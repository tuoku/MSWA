'use strict';

const body = document.querySelector('body');
const main = document.querySelector('main');

//Bottom navs center button
const userCreatePost = document.getElementById('addPostBtn');
const desktopUserCreatePost = document.getElementById('dAddPostBtn');
userCreatePost.addEventListener('click', () => {
  const createPostModal = document.createElement('div');
  createPostModal.className = 'modal';
  const modalClose = document.createElement('button');
  modalClose.className = 'modalClose';
  modalClose.innerText = 'x';

  modalClose.addEventListener('click', () => {
    createPostModal.classList.toggle('hidden');
    createPostModal.remove();
  });

  const postCreateContainer = document.createElement('div');
  postCreateContainer.className = 'modal-container';
  postCreateContainer.id = 'post-create-container';

  //Form for post creation
  const form = document.createElement('FORM');
  form.id = 'post-create-form';
  form.enctype = 'multipart/form-data';

  const contentInput = document.createElement('INPUT');
  contentInput.setAttribute('type', 'file');
  contentInput.setAttribute('accept', '.jpg, .jpeg, .png, .gif, .mp4, .mpeg, .webm');
  contentInput.setAttribute('placeholder', 'Choose File');
  contentInput.setAttribute('name', 'content');
  contentInput.required = true;

  const captionInput = document.createElement('INPUT');
  captionInput.setAttribute('type', 'text');
  captionInput.setAttribute('placeholder', 'Caption');
  captionInput.setAttribute('name', 'caption');

  const postCreateSubmit = document.createElement('INPUT');
  postCreateSubmit.setAttribute('type', 'submit');

  form.appendChild(contentInput);
  form.appendChild(captionInput);
  form.appendChild(postCreateSubmit);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(captionInput.value.includes('#')) {
      for(let hashtag of captionInput.value.match(/#[^\s#]*/gmi)) {
        if(hashtag.length < 4) {
          alert('Tag needs to be atleast 3 characters long')
          return false;
        }
      }
    }

    const fd = new FormData(form);
    const user = await getUser(loggedInUser());
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: fd,
    };
    const response = await fetch(url + '/post/upload/' + user.id, fetchOptions);
    const json = await response.json();
    if (json.error) {
      alert(json.error);
    } else {
      alert('Post was successfully added');
      createPostModal.remove();
      await getPosts()
    }
  });

  postCreateContainer.appendChild(form);

  createPostModal.appendChild(modalClose);
  createPostModal.appendChild(postCreateContainer);
  body.appendChild(createPostModal);
});

desktopUserCreatePost.addEventListener('click', () => {
  const createPostModal = document.createElement('div');
  createPostModal.className = 'modal';
  const modalClose = document.createElement('button');
  modalClose.className = 'modalClose';
  modalClose.innerText = 'x';

  modalClose.addEventListener('click', () => {
    createPostModal.classList.toggle('hidden');
    createPostModal.remove();
  });

  const postCreateContainer = document.createElement('div');
  postCreateContainer.className = 'modal-container';
  postCreateContainer.id = 'post-create-container';

  //Form for post creation
  const form = document.createElement('FORM');
  form.id = 'post-create-form';
  form.enctype = 'multipart/form-data';

  const contentInput = document.createElement('INPUT');
  contentInput.setAttribute('type', 'file');
  contentInput.setAttribute('accept', '.jpg, .jpeg, .png, .gif, .mp4, .mpeg, .webm');
  contentInput.setAttribute('placeholder', 'Choose File');
  contentInput.setAttribute('name', 'content');
  contentInput.required = true;

  const captionInput = document.createElement('INPUT');
  captionInput.setAttribute('type', 'text');
  captionInput.setAttribute('placeholder', 'Caption');
  captionInput.setAttribute('name', 'caption');

  const postCreateSubmit = document.createElement('INPUT');
  postCreateSubmit.setAttribute('type', 'submit');

  form.appendChild(contentInput);
  form.appendChild(captionInput);
  form.appendChild(postCreateSubmit);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(captionInput.value.includes('#')) {
      for(let hashtag of captionInput.value.match(/#[^\s#]*/gmi)) {
        if(hashtag.length < 4) {
          alert('Tag needs to be atleast 3 characters long')
          return false;
        }
      }
    }

    const fd = new FormData(form);
    const user = await getUser(loggedInUser());
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: fd,
    };
    const response = await fetch(url + '/post/upload/' + user.id, fetchOptions);
    const json = await response.json();
    if (json.error) {
      alert(json.error);
    } else {
      createPostModal.remove();
      await getPosts()
    }
  });

  postCreateContainer.appendChild(form);

  createPostModal.appendChild(modalClose);
  createPostModal.appendChild(postCreateContainer);
  body.appendChild(createPostModal);
});
//Fetches all posts from database and calls function to show them
const getPosts = async () => {
  const response = await fetch(url + '/post');
  const posts = await response.json();
  await createPosts(posts);
};

getPosts();

//Parses token and returns user id if user is signed in
const loggedInUser = (() => {
  try {
    const user = parseJwt(sessionStorage.getItem('token'));
    return user.id;
  } catch (e) {
    return false;
  }
});

//Vote is like/dislike, 1/0 respectively
const votePost = async (postid, voterid, vote) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: `{"postid":"${postid}", "voterid":"${voterid}", "vote":"${vote}"}`,
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
};

const getPostComment = async (id) => {
  const response = await fetch(url + '/post/comments/' + id);
  return await response.json();
};

const openSettings = async (postid) => {
  //Only doable if user has logged in
  if (loggedInUser()) {
    const settingsModal = document.createElement('div');
    settingsModal.className = 'modal';
    const modalClose = document.createElement('button');
    modalClose.className = 'modalClose';
    modalClose.innerText = 'x';

    modalClose.addEventListener('click', () => {
      settingsModal.classList.toggle('hidden');
      settingsModal.remove();
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-container';

    const reportButton = document.createElement('button');
    reportButton.className = 'setting-modal-button';
    reportButton.innerText = 'Report';

    reportButton.addEventListener('click', async () => {
      buttonContainer.innerHTML = '';
      buttonContainer.style.top = '35vh';
      //List of reasons
      const reportReasons = (await (await fetch(
          url + '/post/report/reasons')).json());
      for (const reason of reportReasons) {
        //Creates a button for each button and sets its innerText as reason
        const button = document.createElement('button');
        button.className = 'setting-modal-button';
        button.innerText = reason.name;

        button.addEventListener('click', async () => {
          buttonContainer.innerHTML = '';
          buttonContainer.style.top = '';
          buttonContainer.innerText = 'Thanks for reporting';
          const fetchOptions = {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
          };
          await fetch(url + '/post/report/' + postid + '/' + reason.id,
              fetchOptions);
        });
        //Adds every reason button to container
        buttonContainer.appendChild(button);
      }
    });

    const user = await getUser(loggedInUser());
    //If user is admin then gets extra settings for post
    if (user.isAdmin.data[0] === 1) {
      const removeButton = document.createElement('button');
      removeButton.className = 'setting-modal-button';
      removeButton.id = 'remove-button';
      removeButton.innerText = 'Remove';

      removeButton.addEventListener('click', async () => {
        const fetchOptions = {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        };
        const response = await fetch(url + '/post/remove/' + postid,
            fetchOptions);
        return response.json();
      });

      buttonContainer.appendChild(removeButton);
    }
    buttonContainer.appendChild(reportButton);
    settingsModal.appendChild(modalClose);
    settingsModal.appendChild(buttonContainer);
    body.appendChild(settingsModal);
  } else {
    alert('You have to be logged in to do this action');
  }
};

const getPostsByHashtag = async (id) => {
  const response = await fetch(url + '/post/search/hashtag/' + id)
  const posts = await response.json();
  return await createPosts(posts);
}

const onHashtagClicked = async (hashtag) => {
  console.log('clicked: ' + hashtag)
  const hashTagText = hashtag.replace('#', '')
  const tagResponse = await fetch(url + '/post/hashtag/' + hashTagText);
  const tagJson = await tagResponse.json()
  console.log(tagJson)
  const tagId = tagJson[0].id;
  await getPostsByHashtag(tagId)
}

//TODO: Couple of posts at a time not the whole database
const createPosts = async (posts) => {
  let listOfUserLiked = [];
  if(loggedInUser()) {
    const response = await fetch(url + '/post/userliked/' + loggedInUser());
    listOfUserLiked = await response.json()
  }
  if(posts.length === 0) {
    alert('No posts found')
  } else {
    main.innerHTML = '';
  }
  for (const post of posts) {
    //Creates article elements which is container for post
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
    const profilePicFolder = url + '/uploads/profile/';
    const profilePic = (await getUser(post.owner_id)).profileFilename;
    console.log('profilePic' + profilePic)
    posterProfilePicture.src = profilePicFolder + profilePic;
    posterProfilePicture.alt = 'Profile picture of post owner';
    postUserPictureDiv.appendChild(posterProfilePicture);

    //Top username of poster
    const posterUsername = document.createElement('a');
    posterUsername.href = 'profile.html?id=' + post.owner_id;
    posterUsername.innerText = (await getUser(post.owner_id)).username;
    postUserUsernameDiv.appendChild(posterUsername);

    //Top right settings icon/button
    const postSettingsIcon = document.createElement('img');
    postSettingsIcon.src = './ICONS/settings_icon.svg';
    postSettingsDiv.appendChild(postSettingsIcon);

    //Post content
    if(post.picFilename.includes('VIDEO')) {
      const postContent = document.createElement('video');
      postContent.width = 500;
      postContent.controls = true;
      const postContentSource = document.createElement('source');
      postContentSource.src = url + '/uploads/' + post.picFilename;
      postContentSource.type = 'video/mp4';

      postContent.appendChild(postContentSource)
      postContentDiv.appendChild(postContent);

    }else if (post.picFilename.includes('IMAGE')) {
      const postContent = document.createElement('img');
      postContent.src = url + '/thumbnails/' + post.picFilename;
      console.log(postContent.src)
      postContent.alt = 'Post content';
      postContentDiv.appendChild(postContent);
    }
    
    //Caption
    //Caption text
    const postCaption = document.createElement('p');
    postCaption.className = 'hide-caption';
    postCaption.innerText = post.caption;

    try{
      let template = '<a class="hashtag" onclick="onHashtagClicked({%n})">{%}</a>';

      let html = post.caption
      let matched = html.match(/(\S*#\[[^\]]+\])|(\S*#\S+)/gi);
      for(let x of matched) {
        let templ;
        templ = template;
        templ = templ.replace('{%}', x.replace('#', ''));
        templ = templ.replace('{%n}', "'" + x.slice(1) + "'");
        html = html.replace(x, templ);
      }
      postCaption.innerHTML = html;
      const postCaptionLinks = postCaption.getElementsByClassName('hashtag')
      for(let x of postCaptionLinks) {
        x.innerText = '#' + x.innerText
      }
    }catch (e) {
      console.log(e.message)
    }

    // if(post.caption.includes('@')) {
    //
    // }

    //This creates Show more "button"
    const showMoreLink = document.createElement('a');
    showMoreLink.id = 'showmore' + post.post_id;
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
    postLikeButton.src = './ICONS/arrowup_icon.svg';
    postDislikeButton.src = './ICONS/arrowdown_icon.svg';
    postCommentButton.src = './ICONS/comment_icon.svg';

    for await (const userPost of listOfUserLiked) {
      if(post.post_id === userPost.post_id) {
        if(userPost.liked.data.lastIndexOf(1) !== -1) {
          postLikeButton.src = './ICONS/arrowup_icon_filled.svg';
        } else {
          postDislikeButton.src = './ICONS/arrowdown_icon_filled.svg';
        }
      }
    }

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
      const postCommentUsername = document.createElement('a');
      const postCommentContent = document.createElement('p');

      postCommentUsername.href = 'profile.html?id=' + comment.owner_id;
      postCommentDiv.id = 'post-comment';
      postCommentUsername.id = 'post-comment-username';
      postCommentContent.id = 'post-comment-content';

      postCommentUsername.innerText = (await getUser(
          comment.owner_id)).username;
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

    //Hides show more if caption isnt long enough to overflow
    if (postCaption.scrollWidth <= postCaption.clientWidth) {
      document.getElementById('showmore' + post.post_id).style.display = 'none';
    }

    //Functionality
    postUserUsernameDiv.addEventListener('click', () => {
      window.location.href = 'profile.html?id=' + post.owner_id;
    });

    postSettingsDiv.addEventListener('click', () => {
      openSettings(post.post_id);
    });

    postLikeButtonDiv.addEventListener('click', () => {
      if (loggedInUser()) {
        const startingValue = parseInt(postLikes.innerText);
        votePost(post.post_id, loggedInUser(), 1).then((response) => {
          if (response === 1) {
            postLikes.innerText = (startingValue + 1).toString() + ' likes';
            postLikeButton.src = './ICONS/arrowup_icon_filled.svg';
          }
          if (response === 0) {
            postLikes.innerText = (startingValue - 1).toString() + ' likes';
            postLikeButton.src = './ICONS/arrowup_icon.svg';
          }
          if (response === 2) {
            postLikes.innerText = (startingValue + 2).toString() + ' likes';
            postLikeButton.src = './ICONS/arrowup_icon_filled.svg';
            postDislikeButton.src = './ICONS/arrowdown_icon.svg';
          }
        });
      } else {
        alert('You have to be logged in to like');
      }
    });

    postDislikeButtonDiv.addEventListener('click', () => {
      if (loggedInUser()) {
        const startingValue = parseInt(postLikes.innerText);
        votePost(post.post_id, loggedInUser(), 0).then((response) => {
          if (response === 1) {
            postLikes.innerText = (startingValue - 1).toString() + ' likes';
            postDislikeButton.src = './ICONS/arrowdown_icon_filled.svg';
          }
          if (response === 0) {
            postLikes.innerText = (startingValue + 1).toString() + ' likes';
            postDislikeButton.src = './ICONS/arrowdown_icon.svg';
          }
          if (response === 2) {
            postLikes.innerText = (startingValue - 2).toString() + ' likes';
            postLikeButton.src = './ICONS/arrowup_icon.svg';
            postDislikeButton.src = './ICONS/arrowdown_icon_filled.svg';
          }
        });
      } else {
        alert('You have to be logged in to dislike');
      }
    });

    postCommentButtonDiv.addEventListener('click', () => {
      if (loggedInUser()) {
        //Toggleable commenting field
        postCommentButton.src = './ICONS/comment_icon_filled.svg';
        if (document.getElementById('write-comment-box' + post.post_id)) {
          const commentBox = document.getElementById(
              'write-comment-box' + post.post_id);
          commentBox.remove();
          postCommentButton.src = './ICONS/comment_icon.svg';
        } else {
          const newCommentBox = document.createElement('div');
          newCommentBox.id = 'write-comment-box' + post.post_id;

          const commentForm = document.createElement('FORM');
          const commentInputText = document.createElement('INPUT');
          const commentSubmit = document.createElement('INPUT');
          commentInputText.setAttribute('type', 'text');
          commentInputText.maxLength = 255;
          commentSubmit.setAttribute('type', 'submit');
          commentSubmit.value = 'Comment';

          commentForm.id = 'comment-form';
          commentInputText.id = 'comment-input-text';
          commentInputText.name = 'jsonComment';
          commentSubmit.id = 'comment-submit';

          commentForm.appendChild(commentInputText);
          commentForm.appendChild(commentSubmit);
          newCommentBox.appendChild(commentForm);
          postCommentsDiv.appendChild(newCommentBox);

          commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (commentInputText.value.length > 0) {
              const commentBox = document.getElementById(
                  'write-comment-box' + post.post_id);
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
              
              const response = await fetch(
                  url + '/post/' + post.post_id + '/comment/' + loggedInUser(),
                  fetchOptions);
              postCommentButton.src = './ICONS/comment_icon.svg';
              if (await response) {
                
                const postCommentDiv = document.createElement('div');
                const postCommentUsername = document.createElement('p');
                const postCommentContent = document.createElement('p');
                postCommentDiv.id = 'post-comment';
                postCommentUsername.id = 'post-comment-username';
                postCommentContent.id = 'post-comment-content';

                postCommentUsername.innerText = (await getUser(loggedInUser())).username;
                postCommentContent.innerText = commentInputText.value.substring(0, 255);

                postCommentDiv.appendChild(postCommentUsername);
                postCommentDiv.appendChild(postCommentContent);
                postCommentsDiv.appendChild(postCommentDiv);
              } else {
                console.log('something went wrong');
              }
            } else {
              alert('Submitted comment was empty');
            }
          });
        }
      } else {
        alert('You have to be logged in to comment');
      }
    });

    //Show more "Button"
    showMoreLink.addEventListener('click', () => {
      if (showMoreLink.innerText === 'Show more') {
        showMoreLink.innerText = 'Show less';
        postCaption.className = 'show-caption';
      } else {
        showMoreLink.innerText = 'Show more';
        postCaption.className = 'hide-caption';
      }
    });
  }
};