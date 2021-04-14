'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllPosts = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM user_post');
    return rows;
  }catch (e) {
    console.error('getAllposts:', e.message);
  }
}
const getPostComments = async (id) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM post_comment WHERE post_id = ?', [id]);
    return rows;
  }catch (e) {
    console.error('getPostComment:', e.message);
  }
}

// !await promisePool.query('SELECT * FROM post_like WHERE post_id = ? AND user_id = ? AND hasLiked = ?', [post_id, user_id, 1])

const givePostLike = async (post_id, user_id) => {
  try {
    console.log('post_id:' + post_id);
    console.log('user_id:' + user_id);

    //TODO: Fix sql query to select when dislike exists already
    const [rows] = await promisePool.query('SELECT * FROM post_like WHERE post_id = ? AND user_id = ?', [post_id, user_id])
    console.log(rows);
    if(rows.length === 0) {
      console.log('rows were empty, inside if');
      let date_ob = new Date();
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let hours = date_ob.getHours();
      let minutes = date_ob.getMinutes();
      let seconds = date_ob.getSeconds();
      let datetime = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
      const [rows] = await promisePool.execute('INSERT INTO post_like (post_id, user_id, hasLiked, vst) VALUES (?, ?, ?, ?)', [post_id, user_id, 1, datetime]);
      console.log('postModel givePostLike insert:' + rows);
      const [row] = await promisePool.execute('UPDATE user_post SET likesAmount = likesAmount + 1 WHERE post_id = ?', [post_id]);
      console.log('updated post likeAmount: '+ row);
      return true;
    }else{
      return false;
    }
  }catch (e) {
    console.error('givePostLike:', e.message);
  }
}
const givePostDislike = async (post_id, user_id) => {
  try {
    console.log('post_id:' + post_id);
    console.log('user_id:' + user_id);

    //TODO: Fix sql query to select when like exists already
    const [rows] = await promisePool.query('SELECT * FROM post_like WHERE post_id = ? AND user_id = ?', [post_id, user_id])
    console.log(rows);
    if(rows.length === 0) {
      console.log('rows were empty, inside if');
      let date_ob = new Date();
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let hours = date_ob.getHours();
      let minutes = date_ob.getMinutes();
      let seconds = date_ob.getSeconds();
      let datetime = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
      const [rows] = await promisePool.execute('INSERT INTO post_like (post_id, user_id, hasDisliked, vst) VALUES (?, ?, ?, ?)', [post_id, user_id, 1, datetime]);
      console.log('postModel givePostLike insert:' + rows);
      const [row] = await promisePool.execute('UPDATE user_post SET likesAmount = likesAmount - 1 WHERE post_id = ?', [post_id]);
      console.log('updated post likeAmount: '+ row);
      return true;
    }else{
      return false;
    }
  }catch (e) {
    console.error('givePostLike:', e.message);
  }
}

module.exports = {
  getAllPosts,
  getPostComments,
  givePostLike,
  givePostDislike,
};

// const getUser = async (id) => {
//   try{
//     const [row] = await promisePool.query(`SELECT * FROM user WHERE id = ${id}`);
//     return row;
//   }catch (e) {
//     console.error('error', e.message);
//   }
// };
//
// const addUser = async (user) => {
//   console.log(user)
//   // generating a DATETIME from Date() timestamp
//   // could just use timestamps in db?
//   let date_ob = new Date();
//   let date = ("0" + date_ob.getDate()).slice(-2);
//   let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//   let year = date_ob.getFullYear();
//   let hours = date_ob.getHours();
//   let minutes = date_ob.getMinutes();
//   let seconds = date_ob.getSeconds();
//   let datetime = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
//   let params = [user[0], user[1], user[2], datetime]
//   console.log(params)
//   // insert the new user into the db
//   try{
//     const [row] = await promisePool.execute('INSERT INTO user (username, email, password, vst) VALUES (?, ?, ?, ?)', params);
//     return row;
//   }catch (e) {
//     console.error('error', e.message);
//   }
// }