'use strict';
const userModel = require('../models/userModel');

// find user by first characters
const findByChars = async (req, res) => {
  let rows = await userModel.getUsersByFirstChars(req.params.chars)
  if (rows){
    res.json(rows)
  }
}

const getById = async (req, res) => {
  let row = await userModel.getUser(req.params.id)
  if (row){
    res.json(row)
  }
}

const update_profile = async (req, res) => {
  const resp = await userModel.updateProfile(req.params.id, req.file, req.body);
  res.json(resp);
}

const follow = async (req, res) => {
  const resp = await userModel.follow(req.params.follower, req.params.follows)
  res.json(resp);
}

const is_following = async (req, res) => {
  const resp = await userModel.isFollowing(req.params.follower, req.params.follows)
  console.log(resp)
  if (resp.length > 0){
    res.json({follows: true});
  } else {
    res.json({follows: false})
  }
}

const unfollow = async (req, res) => {
  const resp = await userModel.unfollow(req.params.follower, req.params.follows)
  res.json(resp);
}

module.exports = {
  findByChars,
  getById,
  update_profile,
  follow,
  is_following,
  unfollow,
};