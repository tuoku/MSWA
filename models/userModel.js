'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

// get a single user (+ follower amount) by the user id
const getUser = async (id) => {
  try{
    const [row] = await promisePool.query(`SELECT user.*, COUNT(user_followed.follower_id) AS followers FROM user LEFT JOIN user_followed ON user.id = user_followed.follows_id WHERE id = ${id}`);
    return row;
  }catch (e) {
    console.error('error', e.message);
  }
};

const addUser = async (user) => {
  console.log(user)
  // generating a DATETIME from Date() timestamp
  // could just use timestamps in db?
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  let datetime = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  let params = [user[0], user[1], user[2], datetime]
  console.log(params)
  // insert the new user into the db
  try{
    const [row] = await promisePool.execute('INSERT INTO user (username, email, password, vst) VALUES (?, ?, ?, ?)', params);
    return row;
  }catch (e) {
    console.error('error', e.message);
  }
}
// get a single user by username
const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM user WHERE username = ?;',
        params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
};

// get users whose username starts with the specified letters
const getUsersByFirstChars = async (letters) => {
  try {
    console.log(letters);
    const [rows] = await promisePool.execute(
        'SELECT * FROM user WHERE username LIKE CONCAT(?,"%");', [letters]);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
}

const updateProfile = async (user, file, body) => {
  console.log(user,file,body)
  if(file){
  try {
    const [rows] = await promisePool.execute(
        'UPDATE user SET bioText = ?, profileFilename = ? WHERE id = ?', [body.bioText, file.filename, user]);
    return rows;
  } catch (e) {
    console.log('updateProfile', e.message);
  }
  } else {
    try {
      const [rows] = await promisePool.execute(
          'UPDATE user SET bioText = ? WHERE id = ?', [body.bioText, user]);
      return rows;
    } catch (e) {
      console.log('updateProfile', e.message);
    }
  }
}

const follow = async (follower, follows) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO user_followed (follower_id, follows_id) VALUES (?, ?)', [follower, follows]
    )
    return rows;
  } catch (e){
    console.log('follow ' + e.message)
  }
}

const isFollowing = async (follower, follows) => {
  console.log( follower, follows)
  try {
    const [rows] = await promisePool.execute(
        'SELECT * FROM user_followed WHERE follower_id = ? AND follows_id = ?', [follower, follows]
    )
    return rows;
  } catch (e) {
    console.log(e.message)
  }
}

const unfollow = async (follower, follows) => {
  try {
    const [rows] = await promisePool.execute(
        'DELETE FROM user_followed WHERE follower_id = ? AND follows_id = ?', [follower, follows]
    )
    return rows;
  } catch (e){
    console.log('follow ' + e.message)
  }
}

module.exports = {
  getUser,
  addUser,
  getUserLogin,
  getUsersByFirstChars,
  updateProfile,
  follow,
  isFollowing,
  unfollow,
};
