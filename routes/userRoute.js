const express = require('express');
const router = express.Router();

const userCtrl = require('../controlleurs/userControl');
const checkEmail = require('../middleware/check_email');
const checkPassword = require("../middleware/check_password");

router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
