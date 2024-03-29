const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users')
const User = require('../models/user');
const passport = require('passport');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/register/verify')
    .get(users.renderVerification)
    .post(catchAsync(users.verify))
    .put(catchAsync(users.resendVerification))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login',keepSessionInfo: true,}), users.login)

router.route('/logout')
    .get(users.logout)

module.exports = router;