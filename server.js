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
    credentials: {
        client_email: "sauce-172@sauce-411723.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDhHwAFPs8EWLhX\nI+4ytFdf99ZxszzOCibB7QcjFfpX3YnwKqW5BuOy1FwdswIDlRXTueiblOYGdqc2\n9L2t9K7vUZ4MhBxkQuluaW7yKUu/jfwc5zAU3CYCFGIufMGRZESNTUTzRNGBbDUt\nNWHHASdvVr2KQ2Fe/wdCooszKuefqh/8AJzODlBfa5AGJMbh84pE37+8AGOHCQA6\nFSxAo1zNvnwPvX/Ucli8pHCXk6up5SHcCKoPFxfDujxf8t6cv4FlG9h+tqBjKwzK\nM2/NRpW1w7AIGnKnC+z5+Nrd401SQnLpvrsZyj/JdbMK+3Uy8Nv5uOTXa54waWLJ\nwYerorH7AgMBAAECggEAA52U17mc2VMiHlibfqTBugtn84NPUbEn0t1KBQ4gTtaC\nlaD7ftayCw2OS9mXXwXNZH8Epz942BCerACBJnuFbtel9BDXHToA/t7bSk16YEw1\nlyRbZapemJG7dfIeU/eRSdeuL+w+6nqn3cKQ8ch+Z/peU2Dtb8Bd65hitfDjr6n5\nUk1s6IobopIM7jANCxavpdMZ8pAu7yuyGJ8V2xMS6946fdMeWEaHtigGIdiUPdPO\n9aymgxpPh98k6wF++kjAIAg/WGnWWbM2yjkLoOtsE4MU11uh6odCcJ6msYdFecW5\nsTz+ywZrhP3mHMT2e9ABQIcrjDITlq59TpVj3m9muQKBgQD1eIa3mN//vPOwSXh4\narrY3JxPonwWHgp0UFPnPIYdApYKWPQVHZkii2As5TbjMQ4vriOw9nnk07HX73Qb\nzwEUQAFkpA9d5aqjMW5MoiDLiT+BmxpjZO000w0KmvH3UBqQcmVXAnPCIbftQW03\nE4Q8FE+LKcT7g2nvnSUXWytNPwKBgQDqxwRet4qkIu/EOPY3KfiaCtIgfKnoOgIa\nVZ5K12gGrbggFowVtV2USSqTSZsbSIkIdwIx4UHyR0q071qiNkImlWgATNcRooyy\niW7wes1y3/IOidrcmlaWBdky4hHRasxuDg7S27mJf/DnbpnbBpQQbijFanO/U4B3\nUXb0SfEgRQKBgCu2zg7uG534cVFIlDqljybFitSns/9gVC5Ii9iXL68E4eFv2+/S\nuI2tUnBMVYz6FHOrSFHgYu68QGSbEQtOvvtzNoxMpyvqlYvAZssg6EQ26edTzsw6\nkf+hQiZMV6DaVBC7Po7TMfg1dwK6bw+q2xaz60J2Ks07pub0DkHti3WTAoGAH+7l\n50QrtVuTJStiQeqRh9JE9mo+afnJ428V0rQt0Aq86pBmiWVbzxmMkvAGCtX43Y/i\nWop6/8s2nBmaSEn9AWZ8+N16u0lSvc33qvnpC+Dt+ZBClpLfiBRPkJ4zMjrGh4md\n9owwVkVyrOfcQXBJn1p8bS2nhLSE2rXX6i5Mf8kCgYB29xuidLAm8mBwCpg+223H\nWN8MnFHjM4BzKXaW+oGAb5iPNCuwYTCTHANStrtyv9JWng4gL20NkmIpvX1LddVZ\nzpFTyghBg7jqzkDMlbdlDiCrG7ranhv00sP1NOTqM6d/TCh6v2J7dnIjFimw1eUN\nXCC9p7esR+bx2ms9FzqEog==\n-----END PRIVATE KEY-----\n"
    },
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