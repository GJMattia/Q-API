const express = require('express');
const router = express.Router();
const accountsCtrl = require('../controllers/accounts');


router.get('/', accountsCtrl.getAccount);

router.get('/all', accountsCtrl.getAllAccounts);

router.post('/', accountsCtrl.createAccount);

router.put('/motto', accountsCtrl.editMotto);

router.put('/pic', accountsCtrl.updatePicture);

router.put('/xp', accountsCtrl.addXp);

router.put('/stats', accountsCtrl.submitAnswer);

router.put('/powerups', accountsCtrl.usePowerup);

module.exports = router;