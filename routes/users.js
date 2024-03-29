const express = require('express')
const router = express.Router()
const usersCtrl = require('../controllers/users')
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.post('/checkuser', usersCtrl.checkUser);
router.post('/', usersCtrl.create);
router.post('/login', usersCtrl.login);
router.get('/check-token', ensureLoggedIn, usersCtrl.checkToken);


module.exports = router