'use strict';
const express = require('express');
const multer = require('multer');
const router = express.Router();
const postController = require('../controllers/postController');
const parser = require('body-parser');
const passport = require('../utils/pass');
const jsonParser = parser.json();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/mpeg' ||
      file.mimetype === 'video/webm' ||
      file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const testFile = (req, res, next) => {
  if (req.file) {
    console.dir(req.file)
    next();
  } else {
    res.status(400).json({error: 'File is not correct or no file selected'});
  }
};

//TODO:Return error in else?
const isAdmin = (req, res, next) => {
  console.dir(req.user)
  if(req.user[0].isAdmin) {
    next();
  }else{
  }
}

const storage = multer.diskStorage(
    {
      destination: (req, file, cb) => {
        cb(null, 'uploads/')
      },
      filename: (req, file, cb) => {
        if (file.mimetype === 'video/mp4' ||
            file.mimetype === 'video/peg' ||
            file.mimetype === 'video/webm') {
          cb(null, 'VIDEO-' + Date.now() + Math.round(Math.random() * 1E9))
        } else {
          cb(null, 'IMAGE-' + Date.now() + Math.round(Math.random() * 1E9))
        }
      }
    }
)

const upload = multer({
  fileFilter,
  // 50MB = 52428800
  // 8 MB = 8388608
  //limits: {fileSize: }
  storage: storage
});

//GET
router.get('/', postController.posts_get);
router.get('/owner/:id', postController.post_get_username);
router.get('/comments/:id', postController.post_get_comments);
router.get('/:id/votecount', postController.post_get_vote_count);
router.get('/report/reasons', postController.report_reasons);
router.get('/hashtag/:chars', postController.get_hashtags);
router.get('/hashtag/get/popular', postController.get_popular_hashtags);
router.get('/search/hashtag/:tagid', postController.post_get_by_hashtag);
router.get('/userliked/:id', postController.post_get_liked_by_user);

//POST
router.post('/:postid/comment/:ownerid', passport.authenticate('jwt', {session: false}), jsonParser, postController.post_comment_upload);
router.post('/vote', passport.authenticate('jwt', {session: false}), postController.post_vote);
router.post('/upload/:id',
    upload.single('content'),
    testFile,
    postController.crop_image,
    postController.post_create);
router.post('/remove/:id', passport.authenticate('jwt', {session: false}), isAdmin, postController.post_remove);
router.post('/report/:postid/:reportid', passport.authenticate('jwt', {session: false}), postController.post_report);


module.exports = router;