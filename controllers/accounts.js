const Account = require('../models/account');

module.exports = {
    createAccount,
    getAccount,
    editMotto
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
        account.description = motto;
        await account.save();
        res.json('SUCCESS');
    } catch (error) {
        console.error('Error changing motto', error)
    }
}

