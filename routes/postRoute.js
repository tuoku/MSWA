'use strict';
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({extended: false});
const jsonParser = parser.json()
const rawParser = parser.raw();
const textParser = parser.text({limit: 255});
const {body, sanitizeBody} = require('express-validator');

router.get('/', postController.posts_get);
router.get('/owner/:id', postController.post_get_owner_username);
router.get('/comments/:id', postController.post_get_comments);
router.post('/:postid/likeowner/:ownerid/like', postController.post_like);
router.post('/:postid/likeowner/:ownerid/dislike', postController.post_dislike);
router.delete('/:postid/likeowner/:ownerid/delete', postController.post_vote_delete);
router.post('/:postid/comment/:ownerid', textParser, postController.post_comment_upload);

module.exports = router;