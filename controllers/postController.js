'use strict';

const postModel = require('../models/postModel');
const userModel = require('../models/userModel');

const posts_get = async (req, res) => {
  const postList = await postModel.getAllPosts();
  res.json(postList);
}
const post_get_owner_username = async (req, res) => {
  const postOwner = await userModel.getUser(req.params.id);
  res.json(postOwner);
}

const post_get_comments = async (req,  res) => {
  const postComments = await postModel.getPostComments(req.params.id);
  res.json(postComments);
}

const post_like = async (req, res) => {
  const hasLiked = await postModel.givePostLike(req.params.postid, req.params.ownerid);
  res.json(hasLiked);
}

const post_dislike = async (req ,res) => {
  const hasDisliked = await postModel.givePostDislike(req.params.postid, req.params.ownerid);
  res.json(hasDisliked);
}

const post_vote_delete = async (req, res) => {
  const deleteOk = await postModel.deleteVote(req.params.postid, req.params.ownerid);
  res.json(deleteOk);
}

const post_comment_upload = async (req, res) => {
  console.log('inside controller: '+req.body.jsonComment);
  const uploadComment = await postModel.uploadComment(req.params.postid, req.params.ownerid, req.body.jsonComment);
  res.json(uploadComment);
}
module.exports = {
  posts_get,
  post_get_owner_username,
  post_get_comments,
  post_like,
  post_dislike,
  post_vote_delete,
  post_comment_upload,
};