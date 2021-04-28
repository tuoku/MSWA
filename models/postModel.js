'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

//Method to create DATETIME that fits to database
const dateTimeMaker = () => {
  let date_ob = new Date();
  let date = ('0' + date_ob.getDate()).slice(-2);
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  return (year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' +
      seconds);
};

const getAllPosts = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM user_post WHERE vet IS NULL ORDER BY vst DESC');
    return rows;
  } catch (e) {
    console.error('getAllposts:', e.message);
  }
};

const getPostComments = async (id) => {
  try {
    const [rows] = await promisePool.query(
        'SELECT * FROM post_comment WHERE post_id = ?', [id]);
    return rows;
  } catch (e) {
    console.error('getPostComment:', e.message);
  }
};

const getPostVoteCount = async (id) => {
  try {
    const [rows] = await promisePool.query(
        'SELECT (SELECT COUNT(liked) FROM post_like WHERE post_id = ? AND liked = 1) - (SELECT COUNT(liked)' +
        'FROM post_like WHERE post_id = ? AND liked = 0) AS likesCount',
        [id, id]);
    console.dir(rows[0].likesCount);
    return rows[0].likesCount;
  } catch (e) {
    console.error('getPostVoteCount:', e.message);
  }
};

const votePost = async (req) => {
  try {
    //req.body.vote is a STRING, not INT
    //Query to see if voter has voted post before
    const [hasLikedQuery] = await promisePool.query(
        'SELECT * FROM post_like WHERE post_id = ? AND user_id = ?',
        [req.body.postid, req.body.voterid]);
    //If voter hasn't voted before then this is run
    if (hasLikedQuery.length === 0) {
      const [insertVote] = await promisePool.execute(
          'INSERT INTO post_like (post_id, user_id, liked, vst) VALUES (?, ?, ?, ?)',
          [
            req.body.postid,
            req.body.voterid,
            parseInt(req.body.vote),
            dateTimeMaker()]);
      return insertVote.affectedRows; // 1
    }

    //"Transforms" BIT into BOOL, if liked has 1(true) it goes into if
    if ((hasLikedQuery[0].liked.lastIndexOf(1) !== -1 &&
        parseInt(req.body.vote) === 1) ||
        (hasLikedQuery[0].liked.lastIndexOf(0) !== -1 &&
            parseInt(req.body.vote) === 0)) {
      console.log('Same vote as before, deleting...');
      await promisePool.execute(
          'DELETE FROM post_like WHERE post_id = ? AND user_id = ?',
          [req.body.postid, req.body.voterid]);
      return 0;
    } else {
      console.log('inside else');
      await promisePool.execute(
          'UPDATE post_like SET liked = ? WHERE post_id = ? AND user_id = ?',
          [parseInt(req.body.vote), req.body.postid, req.body.voterid]);
      return 2;
    }
  } catch (e) {
    console.error('likePost:', e.message);
  }
};

const uploadComment = async (post_id, user_id, comment) => {
  try {
    console.log('comment json:' + comment);
    const commentAsString = JSON.stringify(comment);
    console.log('comment after stringify length:' + commentAsString.length);
    if (commentAsString.length === 0) {
      return false;
    }
    const [row] = await promisePool.execute(
        'INSERT INTO post_comment (post_id, owner_id, commentText, vst) VALUES (?, ?, ?, ?);',
        [post_id, user_id, comment, dateTimeMaker()]);
    console.log('postModel uploadComment insert: ', row);
    return true;
  } catch (e) {
    console.error('uploadComment:', e.message);
    return false;
  }
};

const postCreate = async (user_id, content, caption) => {
  try{
    console.log('heres what came into model: ' + user_id + content.filename + caption);
    const [row] = await promisePool.execute(
        'INSERT INTO user_post (owner_id, picFilename, caption, vst) VALUES (?, ?, ?, ?);',
        [user_id, content.filename, caption, dateTimeMaker()]);
    console.log('postCreate insert: ', row);
    return true;
  }catch (e) {
    console.error('postCreate:', e.message);
    return false;
  }
}

const postRemove = async (post_id) => {
  try{
    console.log('inpostremove')
    await promisePool.execute(
        'UPDATE user_post SET vet = ? WHERE post_id = ?',
        [dateTimeMaker(), post_id]);
    return true;
  }catch (e) {
    return false;
  }
}

const postReport = async (report_id, post_id) => {
  try{
    console.log('inside model: ' + report_id, post_id);
    await promisePool.execute('INSERT INTO post_report (report_id, post_id) VALUES (?, ?);',
        [report_id, post_id]);
    return true;
  }catch (e) {
    return false;
  }
}

const reportReasons = async () => {
  try{
    const [row] = await promisePool.query('SELECT * FROM report');
    return row;
  }catch (e) {

  }
}


module.exports = {
  getAllPosts,
  getPostComments,
  votePost,
  uploadComment,
  getPostVoteCount,
  postCreate,
  postRemove,
  postReport,
  reportReasons,
};