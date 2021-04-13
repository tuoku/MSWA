'use strict';
const pool = require('../database/db');
// const promisePool = pool.promise();

const postList = [
  {
    'username': 'maxusernameof16c',
    'caption': 'this caption is 255 characters in total which is max size of tinytext, tinytext is how this caption is saved to database. i ran out what to say so im just gonna go Lorem ipsum in here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id ru',
    'likesAmount': 2147483647,
    'commentsUsername': ['user1', 'user2', 'user3'],
    'commentsText': ['omg my own post', 'jeez', 'ceissi'],

  },
  {
    'username': 'user2',
    'caption': 'this a cat',
    'likesAmount': 100,
    'commentsUsername': ['user2', 'user3', 'user1'],
    'commentsText': ['omg my own post', 'jeez', 'ceissi'],

  },
  {
    'username': 'user3',
    'caption': 'bruh cat',
    'likesAmount': 70,
    'commentsUsername': ['user3', 'user1', 'user2'],
    'commentsText': ['omg my own post', 'jeez', 'ceissi'],

  },
];

// const postList = async () => {
//   try {
//     console.log('postcreate sql run');
//     const [rows] = await promisePool.query('SELECT * FROM user_post');
//     return rows[0];
//   } catch (e) {
//     console.error('userModel:', e.message);
//   }
// };


const body = document.querySelector('body');

const main = document.createElement('main');
//Create elements for post
//This is a container for post
for (let i = 0; i < postList.length; i++) {
  const post = document.createElement('article');

//Header section of post
  const postHeadDiv = document.createElement('header');
  const postUserInfoDiv = document.createElement('div');
  const postUserPictureDiv = document.createElement('div');
  const postUserUsernameDiv = document.createElement('div');
  const postSettingsDiv = document.createElement('div');

//Content section of post
  const postContentDiv = document.createElement('div');

//Ending section of post
  const postEndDiv = document.createElement('div');
  const postCaptionDiv = document.createElement('div');
  const postLikesDiv = document.createElement('div');
  const postOptionsDiv = document.createElement('div');
  const postLikeButtonDiv = document.createElement('div');
  const postDislikeButtonDiv = document.createElement('div');
  const postCommentButtonDiv = document.createElement('div');
  const postCommentsDiv = document.createElement('div');

//Setting element classnames for CSS styling
//Container
  post.className = 'post';

//Header
  postHeadDiv.className = 'post-head';
  postUserInfoDiv.className = 'post-user-info';
  postUserPictureDiv.id = 'post-user-picture';
  postUserUsernameDiv.id = 'post-user-username';
  postSettingsDiv.className = 'post-settings';

//Content
  postContentDiv.className = 'post-content';

//End
  postEndDiv.className = 'post-end';
  postCaptionDiv.className = 'post-caption';
  postLikesDiv.className = 'post-likes';
  postOptionsDiv.className = 'post-options';
  postLikeButtonDiv.className = 'post-like-button';
  postDislikeButtonDiv.className = 'post-dislike-button';
  postCommentButtonDiv.className = 'post-comment-button';
  postCommentsDiv.className = 'post-comments';

  const posterProfilePicture = document.createElement('img');
  posterProfilePicture.src = 'http://placekitten.com/g/32/32';
  posterProfilePicture.alt = 'Profile picture of post owner';
  postUserPictureDiv.appendChild(posterProfilePicture);

//Top username of poster
  const posterUsername = document.createElement('p');
  posterUsername.innerText = postList[i].username;
  postUserUsernameDiv.appendChild(posterUsername);

//Top right settings icon/button
  const postSettingsIcon = document.createElement('img');
  postSettingsIcon.src = './ICONS/settings_icon.png';
  postSettingsDiv.appendChild(postSettingsIcon);

//Post content
  const postContent = document.createElement('img');
  postContent.src = 'http://placekitten.com/g/500/300';
  postContent.alt = 'Post content';
  postContentDiv.appendChild(postContent);

//Caption
  //Caption text
  const postCaption = document.createElement('p');
  postCaption.className = 'hideCaption';
  postCaption.innerText = postList[i].caption;

  //This creates Show more "button"
  const showMoreLink = document.createElement('a');
  showMoreLink.href = '#';
  showMoreLink.innerText = 'Show more';

  postCaptionDiv.appendChild(postCaption);
  postCaptionDiv.appendChild(showMoreLink);

//Like amount
  const postLikes = document.createElement('p');
  postLikes.innerText = postList[i].likesAmount + ' likes';
  postLikesDiv.appendChild(postLikes);

//Like, dislike and comment icons/buttons
  const postLikeButton = document.createElement('img');
  const postDislikeButton = document.createElement('img');
  const postCommentButton = document.createElement('img');
  postLikeButton.src = './ICONS/arrowup_icon.png';
  postDislikeButton.src = './ICONS/arrowdown_icon.png';
  postCommentButton.src = './ICONS/comment_icon.png';
  postLikeButtonDiv.appendChild(postLikeButton);
  postDislikeButtonDiv.appendChild(postDislikeButton);
  postCommentButtonDiv.appendChild(postCommentButton);

  postOptionsDiv.appendChild(postLikeButtonDiv);
  postOptionsDiv.appendChild(postDislikeButtonDiv);
  postOptionsDiv.appendChild(postCommentButtonDiv);

//Comments
  for (let f = 0; f < postList[i].commentsUsername.length; f++) {
    const postCommentDiv = document.createElement('div');
    const postCommentUsername = document.createElement('p');
    const postCommentContent = document.createElement('p');
    postCommentDiv.id = 'post-comment';
    postCommentUsername.id = 'post-comment-username';
    postCommentContent.id = 'post-comment-content';
    postCommentUsername.innerText = postList[i].commentsUsername[f];
    postCommentContent.innerText = postList[i].commentsText[f];
    postCommentDiv.appendChild(postCommentUsername);
    postCommentDiv.appendChild(postCommentContent);
    postCommentsDiv.appendChild(postCommentDiv);
  }

//Setting elements as children of others
  postEndDiv.appendChild(postCaptionDiv);
  postEndDiv.appendChild(postLikesDiv);
  postEndDiv.appendChild(postOptionsDiv);
  postEndDiv.appendChild(postCommentsDiv);

  postUserInfoDiv.appendChild(postUserPictureDiv);
  postUserInfoDiv.appendChild(postUserUsernameDiv);

  postHeadDiv.appendChild(postUserInfoDiv);
  postHeadDiv.appendChild(postSettingsDiv);

  post.appendChild(postHeadDiv);
  post.appendChild(postContentDiv);
  post.appendChild(postEndDiv);

  main.appendChild(post);


  //Functionality
  postUserUsernameDiv.addEventListener('click', () => {
    console.log('Username clicked at post number ' + i);
  });

  postSettingsDiv.addEventListener('click', () => {
    console.log('Settings clicked at post number ' + i);
  });

  postLikeButtonDiv.addEventListener('click', () => {
    console.log('Like clicked at post number ' + i);
    postList[i].likesAmount++;
    postLikes.innerText = postList[i].likesAmount + ' likes';
    console.log('likesamount is now ' + postList[i].likesAmount);
  });

  postDislikeButtonDiv.addEventListener('click', () => {
    console.log('Dislike clicked at post number ' + i);
    postList[i].likesAmount--;
    postLikes.innerText = postList[i].likesAmount + ' likes';
    console.log('likesamount is now ' + postList[i].likesAmount);
  });

  postCommentButtonDiv.addEventListener('click', () => {
    console.log('Comment clicked at post number ' + i);
    if(document.getElementById('write-comment-box' + i)) {
      const commentBox = document.getElementById('write-comment-box' + i);
      commentBox.remove();
    }else {
      const newCommentBox = document.createElement('div');
      newCommentBox.id = "write-comment-box" + i;

      const commentForm = document.createElement('FORM');
      const commentInputText = document.createElement('INPUT');
      const commentSubmit = document.createElement('INPUT');
      commentInputText.setAttribute('type', 'text');
      commentSubmit.setAttribute('type', 'submit');
      commentSubmit.value = 'Comment';

      commentInputText.id = 'commentInputText';
      commentSubmit.id = 'commentSubmit';

      commentForm.onsubmit = () => {
        console.log('uploaded comment was: '+commentInputText.value);

        const commentBox = document.getElementById('write-comment-box' + i);
        commentBox.remove();

        const postCommentDiv = document.createElement('div');
        const postCommentUsername = document.createElement('p');
        const postCommentContent = document.createElement('p');
        postCommentDiv.id = 'post-comment';
        postCommentUsername.id = 'post-comment-username';
        postCommentContent.id = 'post-comment-content';
        postCommentUsername.innerText = 'user4';
        postCommentContent.innerText = commentInputText.value;

        postCommentDiv.appendChild(postCommentUsername);
        postCommentDiv.appendChild(postCommentContent);
        postCommentsDiv.appendChild(postCommentDiv);
      }
      commentForm.appendChild(commentInputText);
      commentForm.appendChild(commentSubmit);
      newCommentBox.appendChild(commentForm);
      postCommentsDiv.appendChild(newCommentBox);
    }
  });

  //Show more "Button"
  showMoreLink.addEventListener('click', () => {
    if (showMoreLink.innerText === 'Show more') {
      showMoreLink.innerText = 'Show less';
      postCaption.className = 'showCaption';
    } else {
      showMoreLink.innerText = 'Show more';
      postCaption.className = 'hideCaption';
    }
  });
}

body.appendChild(main);



