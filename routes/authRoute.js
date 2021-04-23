'use strict';
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const parser = require('body-parser');
const jsonParser = parser.json()
const {body, sanitizeBody} = require('express-validator');
const passport = require('../utils/pass')

router.post('/login',jsonParser, authController.login);
// logout requires jwt auth
router.get('/logout', passport.authenticate('jwt', {session: false}), authController.logout);
router.post('/register', jsonParser,
    [
      body('username', 'minimum 3 characters').isLength({min: 3}),
      body('email', 'email is not valid').isEmail(),
      body('password', 'at least one upper case letter').
          matches('(?=.*[A-Z]).{8,}'),
      sanitizeBody('username').escape(),
    ],
    authController.register,
    authController.login,
);

module.exports = router;