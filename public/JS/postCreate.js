'use strict';

const body = document.querySelector('body');
const main = document.createElement('main');

//url for local development, change on production server
const url = 'http://localhost:3000';

//Fetches all posts from database and calls function to show them
const getPosts = async () => {
  const response = await fetch(url + '/post');
  const posts = await response.json();
  createPosts(posts);
};

const giveLike = async (postid, ownerid) => {
  const response = await fetch(url + '/post/' + postid + '/likeowner/' + ownerid + '/like');
  const hasLiked = await response.json();
  console.log('hasLiked in function giveLike:'+hasLiked);
  return hasLiked;
}

const giveDislike = async (postid, ownerid) => {
  const response = await fetch(url + '/post/' + postid + '/likeowner/' + ownerid + '/dislike');
  const hasDisliked = await response.json();
  console.log(hasDisliked);
  return hasDisliked;
}

const deleteVote = async (postid, ownerid) => {
  await fetch(url + '/post/' + postid + '/likeowner/' + ownerid + '/delete');
}

//Fetches post owners username using id
const getPostOwner = async (id) => {
  const response = await fetch(url + '/post/owner/' + id);
  const postOwner = await response.json();
  return postOwner[0].username;
}

const getPostComment = async (id) => {
  const response = await fetch(url + '/post/comments/' + id);
  const postComments = await response.json();
  console.log(postComments);
  return postComments;
}

getPosts();

const createPosts = async (posts) => {
  for (const post of posts) {
    const postBody = document.createElement('article');

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
    posterProfilePicture.src = 'http://placekitten.com/g/32/32';
    posterProfilePicture.alt = 'Profile picture of post owner';
    postUserPictureDiv.appendChild(posterProfilePicture);

//Top username of poster
    const posterUsername = document.createElement('p');
    //Here should be query to get username from owner_id
    posterUsername.innerText = await getPostOwner(post.owner_id);
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

    // if()

    postCaptionDiv.appendChild(postCaption);
    postCaptionDiv.appendChild(showMoreLink);

//Like amount
    const postLikes = document.createElement('p');
    postLikes.innerText = post.likesAmount + ' likes';
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


    const commentList = await getPostComment(post.post_id);

    for(const comment of commentList) {
      const postCommentDiv = document.createElement('div');
      const postCommentUsername = document.createElement('p');
      const postCommentContent = document.createElement('p');
      postCommentDiv.id = 'post-comment';
      postCommentUsername.id = 'post-comment-username';
      postCommentContent.id = 'post-comment-content';
      postCommentUsername.innerText = await getPostOwner(comment.owner_id);
      postCommentContent.innerText = comment.commentText;
      console.log("comment owner innertext" + postCommentUsername.innerText);
      console.log("comment innertext" + postCommentContent.innerText);
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
    postUserUsernameDiv.addEventListener('click', () => {
      console.log('Username clicked at post number ' + post.post_id);
    });

    postSettingsDiv.addEventListener('click', () => {
      console.log('Settings clicked at post number ' + post.post_id);
    });

    postLikeButtonDiv.addEventListener('click', () => {
      console.log('Like clicked at post number ' + post.post_id);

      //TODO: ownerid should be logged in user
      giveLike(post.post_id, 1).then( (response) => {
        console.log('inside likegiven then: '+response);
        if(response) {
          const likeBaseAmount = post.likesAmount;
          postLikes.innerText = (likeBaseAmount+1).toString() + ' likes';
        }else{
          //TODO:delete vote
          //TODO: ownerid should be logged in user
          deleteVote(post.post_id, 1);
          const likeBaseAmount = post.likesAmount;
          postLikes.innerText = (likeBaseAmount).toString() + ' likes';
        }
      });
      console.log('likesamount is in database as ' + post.likesAmount);
      console.log('likesamount showing to user is ' + postLikes.innerText);
    });

    postDislikeButtonDiv.addEventListener('click', () => {
      console.log('Disike clicked at post number ' + post.post_id);
      //TODO: ownerid should be logged in user
      giveDislike(post.post_id, 1).then( (response) => {
        console.log('inside dislikegiven then: '+response);
        if(response) {
          const likeBaseAmount = post.likesAmount;
          postLikes.innerText = (likeBaseAmount-1).toString() + ' likes';
        }else{
          //TODO: delete vote
          //TODO: ownerid should be logged in user
          deleteVote(post.post_id, 1);
          const likeBaseAmount = post.likesAmount;
          postLikes.innerText = (likeBaseAmount).toString() + ' likes';
        }
      });
      console.log('likesamount is in database as ' + post.likesAmount);
      console.log('likesamount showing to user is ' + postLikes.innerText);
    });

    postCommentButtonDiv.addEventListener('click', () => {
      console.log('Comment clicked at post number ' + post.post_id);
      if(document.getElementById('write-comment-box' + post.post_id)) {
        const commentBox = document.getElementById('write-comment-box' + post.post_id);
        commentBox.remove();
      }else {
        const newCommentBox = document.createElement('div');
        newCommentBox.id = "write-comment-box" + post.post_id;

        const commentForm = document.createElement('FORM');
        const commentInputText = document.createElement('INPUT');
        const commentSubmit = document.createElement('INPUT');
        commentInputText.setAttribute('type', 'text');
        commentSubmit.setAttribute('type', 'submit');
        commentSubmit.value = 'Comment';

        commentInputText.id = 'commentInputText';
        commentSubmit.id = 'commentSubmit';

        //TODO: Comment should be added to post_comment
        commentForm.onsubmit = () => {
          console.log('uploaded comment was: '+commentInputText.value);

          const commentBox = document.getElementById('write-comment-box' + post.post_id);
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

body.appendChild(main);



