const Account = require('../models/account');

module.exports = {
    createAccount,
    getAccount
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
        const stats = await Account.findOne({ user: userID });
        res.json(stats);
    } catch (error) {
        console.error('error creating sheet', error)
    }
};

