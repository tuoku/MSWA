const loginButton = document.getElementById('loginBtn');
const registerModal = document.getElementById('registerModal');
const loginModal = document.getElementById('loginModal');
const modalClosers = document.getElementsByClassName('modalClose');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const bottomNav = document.getElementById('bottomNav');
const searchBar = document.getElementById('headerSearch');
const myProfileBtn = document.getElementById('myProfileBtn');
const homeBtn = document.getElementById('homeBtn');

// Array for storing users fetched during searchbar input
let userSearchArray;

// url for local development, change on production server
const url = 'http://localhost:3000'

// add event listeners to modal close buttons
for(let m of modalClosers){
  m.addEventListener('click', e => {
    m.parentElement.classList.add('hidden')
    document.body.style.overflow = 'scroll';
  })
}

// reveal the registration modal when clicking the login button
loginButton.addEventListener('click', ev => {
  registerModal.classList.remove('hidden')
  document.body.style.overflow = 'hidden';
});

const logOut = async () => {
  try {
    // logging out requires token for authentication
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/auth/logout', options);
    const json = await response.json();
    console.log(json);
    // remove token
    sessionStorage.removeItem('token');
    alert('You have logged out');
    // hide the bottomnav (contains actions for registered users)
    // and switch logout button back to login button
    bottomNav.classList.add('hidden');
    loginButton.classList.remove('hidden');

  }
  catch (e) {
    console.log(e.message);
  }
}

registerForm.addEventListener('submit', async (event) => {
event.preventDefault()
  //serialization handled by serialize.js
  const data = serializeJson(registerForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  console.log(fetchOptions)
  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  console.log('register response', json);
  if (!json.user) {
    alert(json.message);
  } else {
    // save token
    sessionStorage.setItem('token', json.token);
    // hide modal and show bottomnav + logout button
    registerModal.classList.add('hidden');
    alert('Succesfully registered!')
    bottomNav.classList.remove('hidden');
    loginButton.classList.add('hidden');
    document.body.style.overflow = 'scroll';
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  console.log('login response', json);
  if (!json.user) {
    alert(json.message);
  } else {
    // save token
    sessionStorage.setItem('token', json.token);
    // hide modal and show nav + logout
    loginModal.classList.add('hidden')
    bottomNav.classList.remove('hidden');
    loginButton.classList.add('hidden');
    document.body.style.overflow = 'scroll';
    alert('login success!')
  }
})

// event-listener for searchbar input
searchBar.addEventListener('input', async ev => {
  let val = searchBar.value
  // close suggestions box when less than 3 chars inputted
  if(val.length < 3){
    closeAllLists()
  }
  // if user has typed 3 characters
  if (val.length === 3){

    if(val[0] === '@'){
    // fetch all usernames beginning with those 3(2) characters
      let response = await fetch(url + '/user/letters/' + val.substring(1,val.length))
      userSearchArray = await response.json()
      console.log(userSearchArray)
      closeAllLists()
      createLists(userSearchArray,'@','username');
    } else if (val[0] === '#'){
      let response = await fetch(url + '/post/hashtag/' + val.substring(1,val.length))
      userSearchArray = await response.json()
      console.log(userSearchArray)
      closeAllLists()
      createLists(userSearchArray,'#','name');
    }
    else {
    //...
    }
  }
  if (val.length >= 3){
    if(val[0] === '@'){
      closeAllLists()
      createLists(userSearchArray,'@','username');
    } else if (val[0] === '#'){
      closeAllLists()
      createLists(userSearchArray,'#','name');
    }
    else {
      //...
    }
  }
})

const createLists = (array, prefix, fieldName) => {
  let val = searchBar.value
  // create a div that will contain the suggestions:
  a = document.createElement("DIV");
  a.setAttribute("id", this.id + "autocomplete-list");
  a.setAttribute("class", "autocomplete-items");
  //append the div element as a child of the autocomplete container:
  searchBar.parentNode.appendChild(a);
  // for each item in the array...
  for (let i = 0; i < array.length; i++) {
    // check if the item starts with the same letters as the text field value:
    let obj = array[i]
    console.dir(obj)
    if (obj[fieldName].toString().substr(0, val.length - 1).toUpperCase() === val.replace(prefix,'').toUpperCase()) {
      // create a DIV element for each matching element:
      let b = document.createElement("DIV");
      if (fieldName === 'username'){
        let imgSrc = url + '/uploads/profile/' + array[i].id + '.jpg'
        // insert profile pic
        b.innerHTML = "<img src='"+ imgSrc + "' class='suggestionImg imgWithPlaceholder'>"
        // insert a input field that will hold the current array item's value:
        b.innerHTML += "<input type='hidden' value='" + array[i].id + "'>";
        // execute a function when someone clicks on the item value (DIV element):
        b.addEventListener("click", (e) => {
          //closeAllLists();
          console.log(this)
          window.location.href = 'profile.html?id=' + array[i].id
        });
      } else if (fieldName === 'name'){
        // insert a input field that will hold the current array item's value:
        b.innerHTML += "<input type='hidden' value='" + array[i].id + "'>";
        // execute a function when someone clicks on the item value (DIV element):
        b.addEventListener("click", async (e) => {
          //closeAllLists();
          const response = await fetch(url + '/post/search/hashtag/' + array[i].id)
          const posts = await response.json();
          await createPosts(posts);
        });
      }
      // make the matching letters bold:
      b.innerHTML += `<strong>${prefix}` + obj[fieldName].toString().substr(0, val.length -1) + "</strong>";
      b.innerHTML += obj[fieldName].toString().substr(val.length -1);
      a.appendChild(b);
    }
  }
}

// close autofill lists
const closeAllLists = () => {
  let x = document.getElementsByClassName("autocomplete-items");
  for (let i = 0; i < x.length; i++) {
    x[i].parentNode.removeChild(x[i]);
  }
}

// close search suggestions when tapped elsewhere on page
document.addEventListener("click",  (ev) => {
  closeAllLists();
  searchBar.value = ''
});


// switch the registration modal to login modal
// called by html
const logInsteadOfReg = () => {
  registerModal.classList.add('hidden')
  loginModal.classList.remove('hidden')
}
// parse token to json
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

myProfileBtn.addEventListener('click', (ev => {
  const user = parseJwt(sessionStorage.getItem('token'))
  window.location.href = 'profile.html?id=' + user.id
}))

homeBtn.addEventListener('click', ev => {
  window.location.href = 'index.html'
})

// when app starts, check if token exists ( = user is already logged in )
// and show the bottomnav + logout button
if (sessionStorage.getItem('token')) {
  bottomNav.classList.remove('hidden');
  loginButton.classList.add('hidden');
}