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
      file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const testFile = (req, res, next) => {
  if (req.file) {
    next();
  } else {
    res.status(400).json({errors: 'file is not image'});
  }
};

const isAdmin = (req, res, next) => {
  console.log('isadmin middleware:' + req.user[0].isAdmin)
  console.dir(req.user)
  if(req.user[0].isAdmin) {
    console.log('user is admin in route')
    next();
  }else{
  }
}

const upload = multer({dest: 'uploads/', fileFilter:fileFilter});

router.get('/', postController.posts_get);
router.get('/owner/:id', postController.post_get_username);
router.get('/comments/:id', postController.post_get_comments);
router.post('/:postid/comment/:ownerid', passport.authenticate('jwt', {session: false}), jsonParser, postController.post_comment_upload);
router.post('/vote', passport.authenticate('jwt', {session: false}), postController.post_vote);
router.get('/:id/votecount', postController.post_get_vote_count);

router.post('/upload/:id',
    upload.single('content'),
    testFile,
    postController.crop_image,
    postController.post_create);

router.post('/remove/:id', passport.authenticate('jwt', {session: false}), isAdmin, postController.post_remove);

router.post('/report/:postid/:reportid', passport.authenticate('jwt', {session: false}), postController.post_report);

router.get('/report/reasons', postController.report_reasons);

module.exports = router;