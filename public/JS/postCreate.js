'use strict';

const body = document.querySelector('body');

const main = document.createElement('main');
//Create elements for post
//This is a container for post
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
const postCommentDiv = document.createElement('div');

//Setting element classnames for CSS styling
//Container
post.className = "post";

//Header
postHeadDiv.className = "post-head";
postUserInfoDiv.className = "post-user-info";
postUserPictureDiv.id = "post-user-picture";
postUserUsernameDiv.id = "post-user-username";
postSettingsDiv.className = "post-settings";

//Content
postContentDiv.className = "post-content";

//End
postEndDiv.className = "post-end";
postCaptionDiv.className = "post-caption";
postLikesDiv.className = "post-likes";
postOptionsDiv.className = "post-options";
postLikeButtonDiv.className = "post-like-button";
postDislikeButtonDiv.className = "post-dislike-button";
postCommentButtonDiv.className = "post-comment-button";
postCommentsDiv.className = "post-comments";
postCommentDiv.id = "post-comment";

//Creating inner elements of divs and setting them as children
//Top left corner 32x32 profile picture
const posterProfilePicture = document.createElement('img');
posterProfilePicture.src = "http://placekitten.com/g/32/32";
posterProfilePicture.alt = "Profile picture of post owner";
postUserPictureDiv.appendChild(posterProfilePicture);

//Top username of poster
const posterUsername = document.createElement('p');
posterUsername.innerText = "username_here";
postUserUsernameDiv.appendChild(posterUsername);

//Top right settings icon/button
const postSettingsIcon = document.createElement('img');
postSettingsIcon.src = "./ICONS/settings_icon.png";
postSettingsDiv.appendChild(postSettingsIcon);


//Post content
const postContent = document.createElement('img');
postContent.src = "http://placekitten.com/g/500/300";
postContent.alt = "Post content";
postContentDiv.appendChild(postContent);

//Caption
const postCaption = document.createElement('p');
postCaption.innerText = "Here is a caption!";
postCaptionDiv.appendChild(postCaption);

//Like amount
const postLikes = document.createElement('p');
postLikes.innerText = "100 likes";
postLikesDiv.appendChild(postLikes);

//Like, dislike and comment icons/buttons
const postLikeButton = document.createElement('img');
const postDislikeButton = document.createElement('img');
const postCommentButton = document.createElement('img');
postLikeButton.src = "./ICONS/arrowup_icon.png";
postDislikeButton.src = "./ICONS/arrowdown_icon.png";
postCommentButton.src = "./ICONS/comment_icon.png";
postLikeButtonDiv.appendChild(postLikeButton);
postDislikeButtonDiv.appendChild(postDislikeButton);
postCommentButtonDiv.appendChild(postCommentButton);

postOptionsDiv.appendChild(postLikeButtonDiv);
postOptionsDiv.appendChild(postDislikeButtonDiv);
postOptionsDiv.appendChild(postCommentButtonDiv);

//Comments
const postCommentUsername = document.createElement('p');
const postCommentContent = document.createElement('p');
postCommentUsername.id= "post-comment-username";
postCommentContent.id = "post-comment-content";
postCommentUsername.innerText = "username_here";
postCommentContent.innerText = "jeez";

postCommentDiv.appendChild(postCommentUsername);
postCommentDiv.appendChild(postCommentContent);
postCommentsDiv.appendChild(postCommentDiv);

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

body.appendChild(main);


//Functionality
postUserUsernameDiv.addEventListener("click", () => {
  console.log("Username clicked")
});

postSettingsDiv.addEventListener("click", () => {
  console.log("Settings clicked");
});

postLikeButtonDiv.addEventListener("click", () => {
  console.log("Like clicked");
});
postDislikeButtonDiv.addEventListener("click", () => {
  console.log("Dislike clicked");
});
postCommentButtonDiv.addEventListener("click", () => {
  console.log("Comment clicked");
});


