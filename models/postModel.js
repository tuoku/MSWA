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
  return (year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds);
};

// Method for parsing hashtags from a string into an array of strings
// and uploading each tag into db
// each tag is UNIQUE in db
const parseTags = async (string, postID) => {
  let tags = string.match(/#[^\s#]*/gmi);
  for(let tag of tags){
    try {
      await promisePool.query('INSERT INTO hashtag (name) VALUES (?)', [tag.replace('#','')]);
    } catch (e) {
      console.log(e)
    }
    // link tags to post
    try{
      let [tagrow] = await promisePool.query('SELECT * FROM hashtag WHERE name = ?', [tag.replace('#','')])
      await promisePool.query('INSERT INTO post_tags VALUES (?, ?)', [postID, tagrow[0].id])
    } catch (e) {
      console.log(e)
    }
  }
}

// method for finding hashtags that start with the specified characters
const getTags = async (chars) => {
  try {
    console.log(chars);
    const [rows] = await promisePool.execute(
        'SELECT * FROM hashtag WHERE name LIKE CONCAT(?,"%");', [chars]);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
}

const getAllPosts = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM user_post WHERE vet IS NULL ORDER BY vst DESC');
    return rows;
  } catch (e) {
    console.error('getAllposts:', e.message);
  }
};

const getPostsByHashtag = async (tagid) => {
  try{
    const [row] = await promisePool.query('SELECT * FROM post_tags WHERE tag_id = ?', [tagid]);
    if(row.length > 0) {
      const [rows] = await promisePool.query('SELECT * FROM user_post LEFT JOIN post_tags ON user_post.post_id = post_tags.post_id WHERE vet IS NULL AND post_tags.tag_id = ? ORDER BY vst DESC', [tagid])
      return rows
    }
    return [];
  }catch (e) {
    console.error('getPostsByHashtag:', e.message);
  }
};

const getPostComments = async (id) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM post_comment WHERE post_id = ?',
        [id]);
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
    return rows[0].likesCount;
  } catch (e) {
    console.error('getPostVoteCount:', e.message);
  }
};

const getPostsLikedByUser = async (id) => {
  try{
    const [rows] = await promisePool.query(
        'SELECT user_post.post_id, post_like.liked FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE post_like.user_id = ?', [id])
    return rows;
  }catch (e) {
    console.error('getPostsLikedByUser:', e.message);
  }
}

const votePost = async (req) => {
  try {
    //req.body.vote is a STRING, not INT
    //Query to see if voter has voted post before
    const [hasLikedQuery] = await promisePool.query('SELECT * FROM post_like WHERE post_id = ? AND user_id = ?',
        [req.body.postid, req.body.voterid]);
    //If voter hasn't voted before then this is run
    if (hasLikedQuery.length === 0) {
      const [insertVote] = await promisePool.execute('INSERT INTO post_like (post_id, user_id, liked, vst) VALUES (?, ?, ?, ?)',
          [
              req.body.postid,
              req.body.voterid,
              parseInt(req.body.vote),
              dateTimeMaker()]);
      return insertVote.affectedRows; // 1
    }

    //"Transforms" BIT into BOOL, if liked has 1(true) it goes into if
    //IF Already same user has same vote then deletes it
    if ((hasLikedQuery[0].liked.lastIndexOf(1) !== -1 && parseInt(req.body.vote) === 1) ||
        (hasLikedQuery[0].liked.lastIndexOf(0) !== -1 && parseInt(req.body.vote) === 0)) {
      await promisePool.execute('DELETE FROM post_like WHERE post_id = ? AND user_id = ?',
          [req.body.postid, req.body.voterid]);
      return 0;
    } else {
      await promisePool.execute(
          'UPDATE post_like SET liked = ? WHERE post_id = ? AND user_id = ?',
          [parseInt(req.body.vote), req.body.postid, req.body.voterid]);
      return 2;
    }
  } catch (e) {
    console.error('votePost:', e.message);
  }
};

const uploadComment = async (post_id, user_id, comment) => {
  try {
    const commentAsString = JSON.stringify(comment);
    if (commentAsString.length === 0) {
      return false;
    }
    const [row] = await promisePool.execute('INSERT INTO post_comment (post_id, owner_id, commentText, vst) VALUES (?, ?, ?, ?)',
        [post_id, user_id, comment, dateTimeMaker()]);
    return true;
  } catch (e) {
    console.error('uploadComment:', e.message);
    return false;
  }
};

const postCreate = async (user_id, content, caption) => {
  try{
    const [row] = await promisePool.execute('INSERT INTO user_post (owner_id, picFilename, caption, vst) VALUES (?, ?, ?, ?)',
        [user_id, content.filename, caption, dateTimeMaker()]);
    await parseTags(caption, row.insertId)
    return true;
  }catch (e) {
    console.error('postCreate:', e.message);
    return false;
  }
}

const postRemove = async (post_id) => {
  try{
    await promisePool.execute('UPDATE user_post SET vet = ? WHERE post_id = ?',
        [dateTimeMaker(), post_id]);
    return true;
  }catch (e) {
    console.error('postRemove:', e.message);
    return false;
  }
}

const postReport = async (report_id, post_id) => {
  try{
    await promisePool.execute('INSERT INTO post_report (report_id, post_id) VALUES (?, ?);',
        [report_id, post_id]);
    return true;
  }catch (e) {
    console.error('postReport:', e.message);
    return false;
  }
}

const reportReasons = async () => {
  try{
    const [row] = await promisePool.query('SELECT * FROM report');
    return row;
  }catch (e) {
    console.error('reportReasons:', e.message);
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
  getTags,
  getPostsByHashtag,
  getPostsLikedByUser,
};