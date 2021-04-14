'use strict';
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({extended: false});
const jsonParser = parser.json()
const {body, sanitizeBody} = require('express-validator');

router.get('/', postController.posts_get);
router.get('/owner/:id', postController.post_get_owner_username);
router.get('/comments/:id', postController.post_get_comments);
router.get('/:postid/likeowner/:ownerid', postController.post_like);
router.get('/:postid/likeowner/:ownerid', postController.post_dislike);

module.exports = router;