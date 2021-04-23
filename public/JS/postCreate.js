'use strict';

const body = document.querySelector('body');
const main = document.querySelector('main');


//url for local development, change on production server
// const url = 'http://localhost:3000';

//Fetches all posts from database and calls function to show them
const getPosts = async () => {
  const response = await fetch(url + '/post');
  const posts = await response.json();
  createPosts(posts);
};

getPosts().then( () => {
  loggedInUser()
});

const loggedInUser = () => {
  try{
    const user = parseJwt(sessionStorage.getItem('token'));
    console.log('loggedInUser: ' + user.id);
    return user.id;
  }catch (e) {
    console.log('hasnt logged in')
    return false;
  }
}

//Vote is like/dislike, 1/0 respectively
const votePost = async (postid, voterid, vote) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },

    body: `{ "postid":"${postid}", "voterid":"${voterid}", "vote":"${vote}"}`,
  };
  const response = await fetch(url + '/post/vote', fetchOptions);
  return await response.json();
};

const getPostVoteCount = async (id) => {
  const response = await fetch(url + '/post/' + id + '/votecount');
  return response.json();
};

const getUser = async (id) => {
  const response = await fetch(url + '/post/owner/' + id);
  const postOwner = await response.json();
  return postOwner[0];
}

const getPostComment = async (id) => {
  const response = await fetch(url + '/post/comments/' + id);
  return await response.json();
};

const parseJwt = (token) => {
  try{
    return JSON.parse(atob(token.split('.')[1]));
  }catch (e) {
    return null
  }
}

//TODO: Couple of posts at a time not the whole database
const createPosts = async (posts) => {
  for (const post of posts) {
    const postBody = document.createElement('article');

    //Header section of post
    const postHeadDiv = document.createElement('div');
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

//Setting element classnames
//Container
    postBody.className = 'post';

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

//Mini profile picture top left corner of post
    const posterProfilePicture = document.createElement('img');
    const profilePicFolder = './IMG/';
    const profilePic = (await getUser(post.owner_id)).profileFilename
    posterProfilePicture.src = profilePicFolder + profilePic + '.jpg';
    posterProfilePicture.alt = 'Profile picture of post owner';
    posterProfilePicture.width = '32';
    posterProfilePicture.height = '32';
    postUserPictureDiv.appendChild(posterProfilePicture);

//Top username of poster
    const posterUsername = document.createElement('p');
    posterUsername.innerText = (await getUser(post.owner_id)).username;
    postUserUsernameDiv.appendChild(posterUsername);

//Top right settings icon/button
    const postSettingsIcon = document.createElement('img');
    postSettingsIcon.src = './ICONS/settings_icon.png';
    postSettingsDiv.appendChild(postSettingsIcon);

//Post content
    const postContent = document.createElement('img');
    postContent.src = post.picFilename;
    postContent.alt = 'Post content';
    postContentDiv.appendChild(postContent);

//Caption
    //Caption text
    const postCaption = document.createElement('p');
    postCaption.className = 'hideCaption';
    postCaption.innerText = post.caption;

    //This creates Show more "button"
    const showMoreLink = document.createElement('a');
    showMoreLink.href = '#';
    showMoreLink.innerText = 'Show more';

    postCaptionDiv.appendChild(postCaption);
    postCaptionDiv.appendChild(showMoreLink);

//Like amount
    const postLikes = document.createElement('p');
    postLikes.innerText = await getPostVoteCount(post.post_id) + ' likes';
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

//Fetch post comments
    const commentList = await getPostComment(post.post_id);

    //Loop thru and create elements to insert comments
    for (const comment of commentList) {
      const postCommentDiv = document.createElement('div');
      const postCommentUsername = document.createElement('p');
      const postCommentContent = document.createElement('p');

      postCommentDiv.id = 'post-comment';
      postCommentUsername.id = 'post-comment-username';
      postCommentContent.id = 'post-comment-content';

      postCommentUsername.innerText = (await getUser(comment.owner_id)).username;
      postCommentContent.innerText = comment.commentText;
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

    postBody.appendChild(postHeadDiv);
    postBody.appendChild(postContentDiv);
    postBody.appendChild(postEndDiv);

    main.appendChild(postBody);

    //Functionality
    //TODO: clicking should go to profile page
    postUserUsernameDiv.addEventListener('click', () => {
      console.log('Username clicked at post number ' + post.post_id);
    });

    postSettingsDiv.addEventListener('click', () => {
      console.log('Settings clicked at post number ' + post.post_id);
    });

    //after refresh can still like/dislike
    postLikeButtonDiv.addEventListener('click',  () => {
      if(loggedInUser()) {
        const startingValue = parseInt(postLikes.innerText);
        //TODO: Voterid should be logged in user's
        votePost(post.post_id, loggedInUser(), 1).then((response) => {
          if (response === 1) {
            postLikes.innerText = (startingValue + 1).toString() + ' likes';
          }
          if (response === 0) {
            postLikes.innerText = (startingValue - 1).toString() + ' likes';
          }
          if (response === 2) {
            postLikes.innerText = (startingValue + 2).toString() + ' likes';
          }
        });
      }else{
        alert('You have to be logged in to like');
      }
    });

    postDislikeButtonDiv.addEventListener('click', () => {
      if(loggedInUser()) {
        //TODO: Voterid should be logged in user's
        const startingValue = parseInt(postLikes.innerText);
        votePost(post.post_id, loggedInUser(), 0).then((response) => {
          if (response === 1) {
            postLikes.innerText = (startingValue - 1).toString() + ' likes';
          }
          if (response === 0) {
            postLikes.innerText = (startingValue + 1).toString() + ' likes';
          }
          if (response === 2) {
            postLikes.innerText = (startingValue - 2).toString() + ' likes';
          }
        });
      }else{
        alert('You have to be logged in to dislike');
      }
    });

    postCommentButtonDiv.addEventListener('click', () => {
      if(loggedInUser()) {
        //Toggleable commenting field
        if (document.getElementById('write-comment-box' + post.post_id)) {
          const commentBox = document.getElementById('write-comment-box' + post.post_id);
          commentBox.remove();
        } else {
          const newCommentBox = document.createElement('div');
          newCommentBox.id = 'write-comment-box' + post.post_id;

          const commentForm = document.createElement('FORM');
          const commentInputText = document.createElement('INPUT');
          const commentSubmit = document.createElement('INPUT');
          commentInputText.setAttribute('type', 'text');
          commentSubmit.setAttribute('type', 'submit');
          commentSubmit.value = 'Comment';

          commentInputText.id = 'commentInputText';
          commentInputText.name = 'jsonComment';
          commentSubmit.id = 'commentSubmit';

          commentForm.appendChild(commentInputText);
          commentForm.appendChild(commentSubmit);
          newCommentBox.appendChild(commentForm);
          postCommentsDiv.appendChild(newCommentBox);

          //TODO: Sanitize input before sending it to model
          commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if(commentInputText.value.length > 0) {
              const commentBox = document.getElementById('write-comment-box' + post.post_id);
              commentBox.remove();

              const data = serializeJson(commentForm);
              const fetchOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify(data),
              };
              const response = await fetch(url + '/post/' + 1 + '/comment/' + loggedInUser(), fetchOptions);
              await response;
              console.dir(response);
              if (response) {
                console.log('comment was submitted');

                const postCommentDiv = document.createElement('div');
                const postCommentUsername = document.createElement('p');
                const postCommentContent = document.createElement('p');
                postCommentDiv.id = 'post-comment';
                postCommentUsername.id = 'post-comment-username';
                postCommentContent.id = 'post-comment-content';

                console.dir(await getUser(loggedInUser()).username);
                postCommentUsername.innerText = (await getUser(loggedInUser())).username;

                postCommentContent.innerText = commentInputText.value;

                postCommentDiv.appendChild(postCommentUsername);
                postCommentDiv.appendChild(postCommentContent);
                postCommentsDiv.appendChild(postCommentDiv);
              } else {
                console.log('something went wrong');
              }
            }else{
              alert('Comment something, bruh comeon');
            }
          });
        }
      }else{
        alert('You have to be logged in to comment');
      }

    });

    //TODO: Show more should be visible only when caption make newline (help: https://stackoverflow.com/questions/783899/how-can-i-count-text-lines-inside-an-dom-element-can-i)
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
};

// body.appendChild(main);



