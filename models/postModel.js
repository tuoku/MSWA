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

const dateTimeMakerDayAgo = () => {
  let date_ob = new Date();
  let dayAgo = date_ob.getDate()-1
  date_ob.setDate(dayAgo)
  let date = ('0' + date_ob.getDate()).slice(-2);
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  return (year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds);
};

const dateTimeMakerWeekAgo = () => {
  let date_ob = new Date();
  let weekAgo = date_ob.getDate()-7
  date_ob.setDate(weekAgo)
  let date = ('0' + (date_ob.getDate())).slice(-2);
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  return (year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds);
};

const dateTimeMakerMonthAgo = () => {
  let date_ob = new Date();
  let monthAgo = date_ob.getMonth()-1
  date_ob.setMonth(monthAgo);
  let date = ('0' + (date_ob.getDate())).slice(-2);
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  return (year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds);
};

const dateTimeMakerYearAgo = () => {
  let date_ob = new Date();
  let yearAgo = date_ob.getFullYear()-1
  date_ob.setFullYear(yearAgo);
  let date = ('0' + (date_ob.getDate())).slice(-2);
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
    if(caption.includes('#')) {
      for(let hashtag of caption.match(/(\S*#\[[^\]]+\])|(\S*#\S+)/gi)) {
        caption = caption.replace(hashtag, hashtag.toLowerCase())
        if(hashtag.length < 4) {
          return false;
        }
      }
    }
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

const popularTags = async () => {
  try {
    const [row] = await promisePool.query('SELECT hashtag.name AS tag, COUNT(post_tags.tag_id) AS count FROM hashtag LEFT JOIN post_tags ON id = post_tags.tag_id GROUP BY tag ORDER BY count DESC LIMIT 8');
    console.log(row)
    return row;
  }catch (e) {
    console.error('popularTags:', e.message);
  }
}

const userPosts = async (id) => {
  try {
    const [row] = await promisePool.query('SELECT * FROM user_post WHERE owner_id = ? AND vet IS NULL ORDER BY vst DESC', [id]);
    console.log(row)
    return row;
  }catch (e) {
    console.error('userPosts: ', e.message);
  }
}

const getById = async (id) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM user_post WHERE post_id = ?',[id]);
    return rows;
  } catch (e) {
    console.error('getById:', e.message);
  }
};

const getPostsByParams = async (sort, since) => {
  try{
    console.log(sort)
    console.log(since)
    if(sort === 'topLikes') {
      if(since === 'today') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerDayAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, (SELECT COUNT(liked) FROM post_like WHERE liked = 1 AND post_like.post_id = user_post.post_id) - (SELECT COUNT(liked) FROM post_like WHERE liked = 0 AND post_like.post_id = user_post.post_id) AS likesCount FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY likesCount DESC', [dateTimeMakerDayAgo()])
        return rows;
      }
      if(since === 'week') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerWeekAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, (SELECT COUNT(liked) FROM post_like WHERE liked = 1 AND post_like.post_id = user_post.post_id) - (SELECT COUNT(liked) FROM post_like WHERE liked = 0 AND post_like.post_id = user_post.post_id) AS likesCount FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY likesCount DESC', [dateTimeMakerWeekAgo()])
        return rows;
      }
      if(since === 'month') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerMonthAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, (SELECT COUNT(liked) FROM post_like WHERE liked = 1 AND post_like.post_id = user_post.post_id) - (SELECT COUNT(liked) FROM post_like WHERE liked = 0 AND post_like.post_id = user_post.post_id) AS likesCount FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY likesCount DESC', [dateTimeMakerMonthAgo()])
        return rows;
      }
      if(since === 'year') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerYearAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, (SELECT COUNT(liked) FROM post_like WHERE liked = 1 AND post_like.post_id = user_post.post_id) - (SELECT COUNT(liked) FROM post_like WHERE liked = 0 AND post_like.post_id = user_post.post_id) AS likesCount FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY likesCount DESC', [dateTimeMakerYearAgo()])
        return rows;
      }
      if(since === 'all') {
        const [rows] = await promisePool.query('SELECT user_post.*, (SELECT COUNT(liked) FROM post_like WHERE liked = 1 AND post_like.post_id = user_post.post_id) - (SELECT COUNT(liked) FROM post_like WHERE liked = 0 AND post_like.post_id = user_post.post_id) AS likesCount FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE user_post.vet IS NULL GROUP BY post_id ORDER BY likesCount DESC')
        return rows;
      }
    }
    if(sort === 'topDislikes') {
      console.log('sort by dislikes')
      if(since === 'today') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerDayAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, (SELECT COUNT(liked) FROM post_like WHERE liked = 1 AND post_like.post_id = user_post.post_id) - (SELECT COUNT(liked) FROM post_like WHERE liked = 0 AND post_like.post_id = user_post.post_id) AS likesCount FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY likesCount ASC', [dateTimeMakerDayAgo()])
        return rows;
      }
      if(since === 'week') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerWeekAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, (SELECT COUNT(liked) FROM post_like WHERE liked = 1 AND post_like.post_id = user_post.post_id) - (SELECT COUNT(liked) FROM post_like WHERE liked = 0 AND post_like.post_id = user_post.post_id) AS likesCount FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY likesCount ASC', [dateTimeMakerWeekAgo()])
        return rows;
      }
      if(since === 'month') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerMonthAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, (SELECT COUNT(liked) FROM post_like WHERE liked = 1 AND post_like.post_id = user_post.post_id) - (SELECT COUNT(liked) FROM post_like WHERE liked = 0 AND post_like.post_id = user_post.post_id) AS likesCount FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY likesCount ASC', [dateTimeMakerMonthAgo()])
        return rows;
      }
      if(since === 'year') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerYearAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, (SELECT COUNT(liked) FROM post_like WHERE liked = 1 AND post_like.post_id = user_post.post_id) - (SELECT COUNT(liked) FROM post_like WHERE liked = 0 AND post_like.post_id = user_post.post_id) AS likesCount FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY likesCount ASC', [dateTimeMakerYearAgo()])
        return rows;
      }
      if(since === 'all') {
        const [rows] = await promisePool.query('SELECT user_post.*, (SELECT COUNT(liked) FROM post_like WHERE liked = 1 AND post_like.post_id = user_post.post_id) - (SELECT COUNT(liked) FROM post_like WHERE liked = 0 AND post_like.post_id = user_post.post_id) AS likesCount FROM user_post LEFT JOIN post_like ON user_post.post_id = post_like.post_id WHERE user_post.vet IS NULL GROUP BY post_id ORDER BY likesCount ASC')
        return rows;
      }
    }
    if(sort === 'mostComments') {
      console.log('sort by com')
      if(since === 'today') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerDayAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, COUNT(comment_id) AS commentCount FROM user_post, post_comment WHERE post_comment.post_id = user_post.post_id AND user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY commentCount DESC', [dateTimeMakerDayAgo()])
        return rows;
      }
      if(since === 'week') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerWeekAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, COUNT(comment_id) AS commentCount FROM user_post, post_comment WHERE post_comment.post_id = user_post.post_id AND user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY commentCount DESC', [dateTimeMakerWeekAgo()])
        return rows;
      }
      if(since === 'month') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerMonthAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, COUNT(comment_id) AS commentCount FROM user_post, post_comment WHERE post_comment.post_id = user_post.post_id AND user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY commentCount DESC', [dateTimeMakerMonthAgo()])
        return rows;
      }
      if(since === 'year') {
        console.log(dateTimeMaker())
        console.log(dateTimeMakerYearAgo())
        const [rows] = await promisePool.query('SELECT user_post.*, COUNT(comment_id) AS commentCount FROM user_post, post_comment WHERE post_comment.post_id = user_post.post_id AND user_post.vst >= ? AND user_post.vet IS NULL GROUP BY post_id ORDER BY commentCount DESC', [dateTimeMakerYearAgo()])
        return rows;
      }
      if(since === 'all') {
        const [rows] = await promisePool.query('SELECT user_post.*, COUNT(comment_id) AS commentCount FROM user_post, post_comment WHERE post_comment.post_id = user_post.post_id AND user_post.vet IS NULL GROUP BY post_id ORDER BY commentCount DESC')
        return rows;
      }
    }
  }catch (e) {
    console.error('getPostsByParams:', e.message);
  }
}

const savePost = async (postId, user) => {
  console.log(postId,user)
  try {
    const [rows] = await promisePool.execute('INSERT INTO user_saved (post_id, owner_id) VALUES (?, ?)', [postId, user])
    return rows
  } catch (e) {
    console.log(e.message)
  }
}

const unsavePost = async (postId, user) => {
  console.log(postId,user)
  try {
    const [rows] = await promisePool.execute('DELETE FROM user_saved WHERE post_id = ? AND owner_id = ?', [postId, user])
    return rows
  } catch (e) {
    console.log(e.message)
  }
}

const savedBy = async (userId) => {
  try {
    const [rows] = await promisePool.execute('SELECT user_post.* FROM user_post LEFT JOIN user_saved ON user_post.post_id = user_saved.post_id WHERE user_saved.owner_id = ?',[userId])
    return rows
  } catch (e) {
    console.log(e.message)
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
  popularTags,
  getPostsLikedByUser,
  userPosts,
  getById,
  getPostsByParams,
  savePost,
  unsavePost,
  savedBy,
};