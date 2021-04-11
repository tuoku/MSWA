'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs')
require('dotenv').config();

// local strategy for username/password login
passport.use(new Strategy(
    async (username, password, done) => {
      const params = [username];
      try {
        const [user] = await userModel.getUserLogin(params);
        console.log('Local strategy', user); // result is binary row
        if (user === undefined) { // user not found
          return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.password)) { // passwords dont match
          return done(null, false);
        }
        delete user.password; // remove password property from user object
        return done(null, {...user}); // use spread syntax to create shallow copy to get rid of binary row type
      } catch (err) { // general error
        return done(err);
      }
    }));

// jwt strategy for authorizations after username/password login
passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey   : process.env.JWT_SECRET
    },
    (jwtPayload, done) => {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      console.log(jwtPayload)
      return userModel.getUser(jwtPayload.id)
      .then(user => {
        return done(null, user);
      })
      .catch(err => {
        return done(err);
      });
    }
));


module.exports = passport;