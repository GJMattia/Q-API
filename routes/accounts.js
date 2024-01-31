const express = require('express');
const router = express.Router();
const accountsCtrl = require('../controllers/accounts');


router.get('/', accountsCtrl.getAccount);

router.post('/', accountsCtrl.createAccount);

router.put('/motto', accountsCtrl.editMotto);

router.put('/pic', accountsCtrl.updatePicture);

module.exports = router;