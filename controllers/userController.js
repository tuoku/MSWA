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

module.exports = {
  findByChars,
  getById,
  update_profile,
};