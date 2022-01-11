const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require("../utilities/catchAsync");
const auth = require("../controllers/auth");

router.route('/register')
    .get(auth.getRegisterForm)
    .post(catchAsync(auth.registerUser))

router.route('/login')
    .get(auth.getLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), auth.logUserIn)

router.get('/logout', auth.logUserOut)

module.exports = router;