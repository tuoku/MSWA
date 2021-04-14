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
  const postComments =await postModel.getPostComments(req.params.id);
  res.json(postComments);
}

const post_like = async (req, res) => {
  const hasLiked = await postModel.givePostLike(req.params.postid, req.params.ownerid);
  console.log('hasliked in controller: ' + hasLiked);
  res.json(hasLiked);
}

const post_dislike = async (req ,res) => {
  const hasDisliked = await postModel.givePostDislike(req.params.postid, req.params.ownerid);
  console.log('hasdisliked in controller: ' + hasDisliked);
  res.json(hasDisliked);
}
module.exports = {
  posts_get,
  post_get_owner_username,
  post_get_comments,
  post_like,
  post_dislike,
};