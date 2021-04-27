'use strict';

const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const {cropImage} = require('../utils/resize');

const posts_get = async (req, res) => {
  const postList = await postModel.getAllPosts();
  res.json(postList);
}
const post_get_username = async (req, res) => {
  const postOwner = await userModel.getUser(req.params.id);
  res.json(postOwner);
}

const post_get_comments = async (req,  res) => {
  const postComments = await postModel.getPostComments(req.params.id);
  res.json(postComments);
}

const post_get_vote_count = async (req, res) => {
  const postVoteCount = await postModel.getPostVoteCount(req.params.id);
  res.json(postVoteCount);
}

const post_vote = async (req, res) => {
  const voteValue = await postModel.votePost(req);
  res.json(voteValue);
}

const post_comment_upload = async (req, res) => {
  const uploadComment = await postModel.uploadComment(req.params.postid, req.params.ownerid, req.body.jsonComment);
  res.send(uploadComment);
}

const post_create = async (req, res) => {
  const postCreate = await postModel.postCreate(req.params.id, req.file, req.body.caption);
  res.send(postCreate);
}

const crop_image = async (req, res, next) => {
  try {
    const crop = await cropImage(req.file.path, req.file.filename);
    if(crop) {
      next();
    }
  }catch (e) {
    res.status(400).json({error: e.message});
  }
}

module.exports = {
  posts_get,
  post_get_username,
  post_get_comments,
  post_comment_upload,
  post_vote,
  post_get_vote_count,
  post_create,
  crop_image,
};