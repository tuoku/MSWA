'use strict';
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({extended: false});
const jsonParser = parser.json()
const {body, sanitizeBody} = require('express-validator');

router.post('/login',urlencodedParser, authController.login);
router.get('/logout', authController.logout);
router.post('/register', urlencodedParser,
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