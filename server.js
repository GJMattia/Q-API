const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');

const app = express();

const userRouter = require('./routes/users');
const accountsRouter = require('./routes/accounts');


const SERVERDEVPORT = 4741
const CLIENTDEVPORT = 5173


mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('connected', function () {
    console.log(`Connected to ${db.name} at ${db.host}:${db.port}`);
});


app.use(require('./config/checkToken'));



app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${CLIENTDEVPORT}` }))

const PORT = process.env.PORT || SERVERDEVPORT


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const ensureLoggedIn = require('./config/ensureLoggedIn');

app.use('/users', userRouter);

app.use('/accounts', ensureLoggedIn, accountsRouter);


//START PICTURE UPLOAD
const storage = new Storage({
    credentials: (require('./sauce.json'))
});
const bucket = storage.bucket('saucebucket1916');

const upload = multer({
    storage: multer.memoryStorage(),
});

app.post('/upload', upload.single('profilePicture'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const fileName = Date.now() + '-' + file.originalname;
        const bucketFile = bucket.file(fileName);

        const stream = bucketFile.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        stream.end(file.buffer);

        stream.on('finish', () => {
            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            return res.status(200).json({ success: true, message: 'File uploaded successfully', imageUrl });
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
//END PICTURE UPLOAD


app.listen(PORT, () => {
    console.log('listening on port ' + PORT)
})




module.exports = app