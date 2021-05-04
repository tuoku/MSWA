const usernameField = document.getElementById('username');
const followerAmountField = document.getElementById('followerAmount');
const bioField = document.getElementById('bio');
const menuItems = document.getElementById('menuItems');
const followButton = document.getElementById('followBtn');
const burger = document.getElementById('burger');
const tabs = document.getElementsByClassName('tabs');
const guestPostTitle = document.getElementById('guestFeedTitle');
const vSeparator = document.getElementById('vSeparator');
const postsButton = document.getElementById('postsBtn');
const editModal = document.getElementById('editModal');
const editBio = document.getElementById('bioEdit');
const editForm = document.getElementById('editForm');
const profilePic = document.getElementById('profilePic');
const postsDiv = document.getElementById('posts');
const postModal = document.getElementById('postModal');


let mUser
let isFollowing
let followAmount
let userPosts

if(!(sessionStorage.getItem('token'))){
  document.getElementById('dAddPostBtn').style.display = 'none';
  desktopMyProfileBtn.style.display = 'none';
}

const openPost = async (id) => {
  document.getElementsByTagName('main').innerHTML = ''
  postModal.classList.toggle('hidden');
  const post = await fetch(url + '/post/getbyid/' + id)
  const postt = await post.json()
  console.dir(postt)
  await createPosts(postt)
}


// get the requested users id from url params
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get('id');

// fetch the appropriate users information
const init = async () => {
  const response = await fetch(url + '/user/' + userId)
  const user = await response.json()
  mUser = user[0]
  followAmount = mUser.followers
  const posts = await fetch(url + '/post/userposts/' + userId)
  userPosts = await posts.json()
  try {
    const following = await fetch(
        url + '/user/follows/' + parseJwt(sessionStorage.getItem('token')).id +
        '/' + userId)
    isFollowing = (await following.json()).follows
    console.log(isFollowing)
  } catch (e) {
    console.log(e.message)
  }
}

// after fetched update the document with the information
init().then( () => {
  usernameField.innerHTML = `<strong> ${mUser.username} </strong>`
  followerAmountField.innerHTML = `<strong> ${followAmount} </strong> <br> followers`
  bioField.innerHTML = mUser.bioText
  profilePic.src = url + '/uploads/profile/' + mUser.profileFilename
  if (isFollowing){
    followButton.innerText = 'Unfollow'
  }
  try {
    let token = sessionStorage.getItem('token')
    if(token) {
      let user = parseJwt(token)
      if(user.id === mUser.id) {
        // user is viewing their own profile
        // enable extra functions
        enableActions()
      }
    }
  } catch (e){
    console.log(e)
  }
  if(userPosts.length > 0) {
    postsDiv.innerHTML = ''
    for (let p of userPosts) {
      const img = document.createElement('img')
      img.src = url + '/uploads/' + p.picFilename
      img.classList.add('feedPic')
      img.setAttribute("onclick", 'openPost("'+ p.post_id + '")')
      postsDiv.appendChild(img)
    }
  }
  document.getElementsByTagName('main').innerHTML = ''
})

// add event listeners to tabs (own profile only)
for(let e of tabs){
  e.addEventListener('click', (evt) => {
    openTab(evt, e.innerText.toLowerCase())
  })
}

const toggleMenu = () => {
  let x = document.getElementById("menuItems");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
  burger.classList.toggle('change');
}

// show actions intended for users viewing their own profile
const enableActions = () => {
  menuItems.innerHTML += `<a href="#" onclick="logOut()" style="background: crimson; color: white" >Log Out</a>`
  followButton.innerText = 'Edit profile'
  for(let e of tabs){
    e.style.display = 'block'
  }
  vSeparator.style.display = 'block'
  guestPostTitle.style.display = 'none'
  // set default view to Posts
  postsButton.click()
}

followButton.addEventListener('click', async () => {
  if(followButton.innerText === 'Edit profile'){
    editModal.classList.toggle('hidden');
    editBio.innerText = bioField.innerHTML
  } else if (followButton.innerText === 'Follow') {
    const user = parseJwt(sessionStorage.getItem('token'))
    if (user) {
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        }
      };
      const response = await fetch(
          url + '/user/follow/' + user.id + '/' + mUser.id, fetchOptions);
      const json = await response.json();
      if (json.error) {
        alert(json.error);
      } else {
        followAmount++
        followerAmountField.innerHTML = `<strong> ${followAmount} </strong> <br> followers`
        followButton.innerText = 'Unfollow'
      }
    } else alert('You must be logged in to follow')
    } else if (followButton.innerText === 'Unfollow') {
    const userr = parseJwt(sessionStorage.getItem('token'))
        const fetchOptions = {
           method: 'DELETE',
           headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      }
    };
    const response = await fetch(
        url + '/user/unfollow/' + userr.id + '/' + mUser.id, fetchOptions);
    const json = await response.json();
    if (json.error) {
      alert(json.error);
    } else {
      followAmount--
      followerAmountField.innerHTML = `<strong> ${followAmount} </strong> <br> followers`
      followButton.innerText = 'Follow'
    }
  }
});

editForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const user = parseJwt(sessionStorage.getItem('token'))
  const fd = new FormData(editForm);
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/user/update/' + user.id, fetchOptions);
  const json = await response.json();
  if (json.error) {
    alert(json.error);
  } else {
    alert('success');
    location.reload()
  }
})

const openTab = (evt, tab) => {
  // Declare all variables
  let i, feeds, tablinks;

  // Get all elements with class="feeds" and hide them
  feeds = document.getElementsByClassName("feeds");
  for (i = 0; i < feeds.length; i++) {
    feeds[i].style.display = "none";
  }

  // Get all elements with class="tabs" and remove the class "active"
  tablinks = document.getElementsByClassName("tabs");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tab).style.display = "flex";
  evt.currentTarget.className += " active";
}



