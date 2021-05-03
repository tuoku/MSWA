'use strict';
const express = require('express');
const router = express.Router();
const parser = require('body-parser');
const jsonParser = parser.json()
const userController = require('../controllers/userController');
const multer = require('multer');
const passport = require('../utils/pass');

const upload = multer({dest: 'uploads/profile/'});


router.get('/letters/:chars', userController.findByChars)
router.get('/:id', userController.getById)
router.put('/update/:id', passport.authenticate('jwt', {session: false}), upload.single('img'), userController.update_profile)
router.post('/follow/:follower/:follows', passport.authenticate('jwt', {session: false}), userController.follow)
router.get('/follows/:follower/:follows', userController.is_following)
router.delete('/unfollow/:follower/:follows', passport.authenticate('jwt', {session: false}), userController.unfollow)

module.exports = router;