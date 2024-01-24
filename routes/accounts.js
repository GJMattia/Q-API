const express = require('express');
const router = express.Router();
const accountsCtrl = require('../controllers/accounts');


router.get('/', accountsCtrl.getAccount);

router.post('/', accountsCtrl.createAccount);

module.exports = router;