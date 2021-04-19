'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const dateTimeMaker = () => {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" +
      seconds);
}

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

// !await promisePool.query('SELECT * FROM post_like WHERE post_id = ? AND user_id = ? AND hasLiked = ?', [post_id, user_id, 1]);

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

const deleteVote = async (post_id, user_id) => {
  //TODO: select is it like or dislike, then update that value to post itself
  try{
    console.log('before sql query');
    const [row] = await promisePool.query('SELECT * FROM post_like WHERE post_id = ? AND user_id = ?', [post_id, user_id]);
    console.log('inside deletevote: ' + row[0].hasLiked);

    // This transforms BIT into BOOL, continues if hasLiked true and hasDisliked false
    // WORKS BUT AFTER THIRD QUERY SLOW
    if(row[0].hasLiked.lastIndexOf(1) !== -1 && !row[0].hasDisliked.lastIndexOf(1) !== -1) {
      //If hasLiked is true then do a query to update user_post to do likesAmount -1
      console.log('INSIDE DELETEVOTE IF(1) and hasLiked is 1');
      await promisePool.execute('DELETE FROM post_like WHERE post_id = ? AND user_id = ?', [post_id, user_id]);
      await promisePool.execute('UPDATE user_post SET likesAmount = likesAmount - 1 WHERE post_id = ?', [post_id]);
      return 1;
    }
    //Same as last if but reversed
    else if(!row[0].hasLiked.lastIndexOf(1) !== -1 && row[0].hasDisliked.lastIndexOf(1) !== -1) {
      //If hasLiked is true then do a query to update user_post to do likesAmount -1
      console.log('INSIDE DELETEVOTE IF(2) and hasDisliked is 1');
      await promisePool.execute('DELETE FROM post_like WHERE post_id = ? AND user_id = ?', [post_id, user_id]);
      await promisePool.execute('UPDATE user_post SET likesAmount = likesAmount + 1 WHERE post_id = ?', [post_id]);
      return 1;
    }

    // NO IMPROVEMENT
    // if(row[0].hasLiked.lastIndexOf(1) !== -1) {
    //   //If hasLiked is true then do a query to update user_post to do likesAmount -1
    //   console.log('INSIDE DELETEVOTE IF(1) and hasLiked is 1');
    //   await promisePool.execute('DELETE FROM post_like WHERE post_id = ? AND user_id = ?', [post_id, user_id]);
    //   await promisePool.execute('UPDATE user_post SET likesAmount = likesAmount - 1 WHERE post_id = ?', [post_id]);
    // }else{
    //   console.log('INSIDE DELETEVOTE IF(2) and hasDisliked is 1');
    //   await promisePool.execute('DELETE FROM post_like WHERE post_id = ? AND user_id = ?', [post_id, user_id]);
    //   await promisePool.execute('UPDATE user_post SET likesAmount = likesAmount + 1 WHERE post_id = ?', [post_id]);
    // }

  }catch (e) {
    console.error('deleteVote:', e.message);
  }
}
const uploadComment = async (post_id, user_id, comment) => {
  console.log('tried insert this into database: ' + comment)
  try{
    // const [row] = await promisePool.execute('INSERT INTO post_comment (post_id, owner_id, commentText, vst) VALUES (?, ?, ?, ?);',
    //     [post_id, user_id, comment, dateTimeMaker()]);
    console.log('postModel uploadComment insert: ', row);
    // return row;
  }catch (e) {
    console.error('uploadComment:', e.message);
  }
}

module.exports = {
  getAllPosts,
  getPostComments,
  givePostLike,
  givePostDislike,
  deleteVote,
  uploadComment
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