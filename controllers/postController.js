'use strict';

const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const {cropImage} = require('../utils/resize');

const posts_get = async (req, res) => {
  const postList = await postModel.getAllPosts();
  res.json(postList);
}

const post_get_by_hashtag = async (req, res) => {
  const postList = await postModel.getPostsByHashtag(req.params.tagid);
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

const post_get_liked_by_user = async (req, res) => {
  const posts = await postModel.getPostsLikedByUser(req.params.id);
  res.json(posts);
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

const get_hashtags = async (req, res) => {
  const tags = await postModel.getTags(req.params.chars);
  res.json(tags)
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

const post_remove = async (req, res) => {
  if(req.user[0].isAdmin) {
    const postRemove = await postModel.postRemove(req.params.id);
    res.send(postRemove);
  } else {
    res.status(400).json({error: e.message});
  }
}

const post_report = async (req, res) => {
  const postReport = await postModel.postReport(req.params.reportid, req.params.postid)
  res.send(postReport);
}

const report_reasons = async (req, res) => {
  const reportReasons = await postModel.reportReasons();
  res.send(reportReasons);
}

const get_popular_hashtags = async (req, res) => {
  const tags = await postModel.popularTags();
  console.log(tags)
  res.send(tags);
};

const user_posts = async (req, res) => {
  const posts = await postModel.userPosts(req.params.id);
  res.json(posts)
}

const get_by_id = async (req, res) => {
  const post = await postModel.getById(req.params.id);
  res.json(post)
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
  post_remove,
  post_report,
  report_reasons,
  get_hashtags,
  post_get_by_hashtag,
  get_popular_hashtags,
  post_get_liked_by_user,
  user_posts,
  get_by_id,
};