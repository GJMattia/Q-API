const Account = require('../models/account');

module.exports = {
    createAccount,
    getAccount,
    editMotto,
    updatePicture,
    addXp,
    submitAnswer,
    usePowerup
};

async function createAccount(req, res) {
    try {
        const userID = req.body.userID;
        const newAccount = await Account.create({ user: userID });
        res.json(newAccount);
    } catch (error) {
        console.error('error creating sheet', error)
    }
};


async function getAccount(req, res) {
    try {
        const userID = req.user._id;
        const account = await Account.findOne({ user: userID });
        res.json(account);
    } catch (error) {
        console.error('error creating sheet', error)
    }
};

async function editMotto(req, res) {
    try {
        const userID = req.user._id;
        const account = await Account.findOne({ user: userID });
        const motto = req.body.motto;
        account.motto = motto;
        await account.save();
        res.json('SUCCESS');
    } catch (error) {
        console.error('Error changing motto', error)
    }
};


async function updatePicture(req, res) {
    try {
        const userID = req.user._id;
        const account = await Account.findOne({ user: userID });
        const pic = req.body.pic;
        account.pic = pic;
        await account.save();
        res.json('SUCCESS');
    } catch (error) {
        console.error('Error changing pic', error)
    }
};

async function addXp(req, res) {
    try {
        const userID = req.user._id;
        const account = await Account.findOne({ user: userID });
        account.xp = account.xp + req.body.xp;
        if (account.xp >= 100) {
            account.level = account.level + 1;
            account.xp = account.xp - 100;
        }
        await account.save();
        res.json(account);
    } catch (error) {
        console.error('Error adding Xp', error)
    }
}

async function submitAnswer(req, res) {
    try {
        const userID = req.user._id;
        const account = await Account.findOne({ user: userID });
        let category = req.body.category;

        if (req.body.status === 1) {
            account.categories[category].right++;
            account.overall.right++;
        } else if (req.body.status === 0) {
            account.categories[category].wrong++;
            account.overall.wrong++;
        }

        await account.save();
        res.json('yeah baby');
    } catch (error) {
        console.error('Error adding Xp', error)
    }
}

async function usePowerup(req, res) {
    try {
        const userID = req.user._id;
        const account = await Account.findOne({ user: userID });
        let powerup = req.body.powerup;

        account.powerups[powerup] = account.powerups[powerup] - 1;
        await account.save();
        res.json(account);
    } catch (error) {
        console.error('Error changing motto', error)
    }
};