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


let mUser

if(!(sessionStorage.getItem('token'))){
  document.getElementById('dAddPostBtn').style.display = 'none';
  desktopMyProfileBtn.style.display = 'none';
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
}

// after fetched update the document with the information
init().then( () => {
  usernameField.innerHTML = `<strong> ${mUser.username} </strong>`
  followerAmountField.innerHTML = `<strong> ${mUser.followers} </strong> <br> followers`
  bioField.innerHTML = mUser.bioText
  try {
    let token = sessionStorage.getItem('token')
    if(token) {
      let user = parseJwt(token)
      if(user.id === mUser.id) {
        // user is viewing his own profile
        // enable extra functions
        enableActions()
      }
    }
  } catch (e){
    console.log(e)
  }
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



