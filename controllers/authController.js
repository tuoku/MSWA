'use strict';
const jwt = require('jsonwebtoken');
const passport = require('../utils/pass');
const userModel = require('../models/userModel');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// local strategy authentication
const login = (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    console.log(err, user, info)
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      });
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }
      // if local auth was a success, return a token to be used for future auths
      // !!!! Remove fields that may contain emojis as they may cause unparseable tokens !!!!!!
      delete user.bioText;
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({user, token});
    });
  })(req,res,next)};

const register = async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('user create error', errors);
    res.send(errors.array());
  } else {
    // hash the password
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    const params = [
      req.body.username,
      req.body.email,
      hash,
    ];
    // if user was saved to db successfully, continue to login automatically
    if (await userModel.addUser(params)) {
      next()
    } else {
      res.status(400).json({error: 'register error'});
    }
  }
};

const logout = (req, res) => {
  req.logout();
  res.json({message: 'logout'});
};

  module.exports = {
    login,
    logout,
    register,
  };