'use strict';
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const parser = require('body-parser');
const jsonParser = parser.json()

router.get('/', postController.posts_get);
router.get('/owner/:id', postController.post_get_username);
router.get('/comments/:id', postController.post_get_comments);
router.post('/:postid/comment/:ownerid', jsonParser, postController.post_comment_upload);
router.post('/vote', postController.post_vote);
router.get('/:id/votecount', postController.post_get_vote_count);

module.exports = router;