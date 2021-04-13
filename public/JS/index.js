const loginButton = document.getElementById('loginBtn');
const logoutButton = document.getElementById('logoutBtn')
const registerModal = document.getElementById('registerModal');
const loginModal = document.getElementById('loginModal');
const modalClosers = document.getElementsByClassName('modalClose');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const bottomNav = document.getElementById('bottomNav');
const searchBar = document.getElementById('headerSearch');
// Array for storing users fetched during searchbar input
let userSearchArray;

// url for local development, change on production server
const url = 'http://localhost:3000'

// add event listeners to modal close buttons
for(let m of modalClosers){
  m.addEventListener('click', e => {
    m.parentElement.classList.add('hidden')
  })
}

// reveal the registration modal when clicking the login button
loginButton.addEventListener('click', ev => {
  registerModal.classList.remove('hidden')
});

logoutButton.addEventListener('click', async event => {
  event.preventDefault();
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
    logoutButton.classList.add('hidden');
    loginButton.classList.remove('hidden');

  }
  catch (e) {
    console.log(e.message);
  }
})

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
    logoutButton.classList.remove('hidden');
    loginButton.classList.add('hidden');
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
    logoutButton.classList.remove('hidden');
    loginButton.classList.add('hidden');
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
    // fetch all usernames beginning with those 3 characters
    let response = await fetch(url + '/user/letters/' + val)
    userSearchArray = await response.json()
    console.log(userSearchArray)
  }
  // if user has typed 3 or more chars
  if(val.length >= 3) {
    closeAllLists()
    // create a div that will contain the suggestions:
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    //append the div element as a child of the autocomplete container:
    searchBar.parentNode.appendChild(a);
    // for each item in the array...
    for (let i = 0; i < userSearchArray.length; i++) {
      // check if the item starts with the same letters as the text field value:
      if (userSearchArray[i].username.toString().substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        // create a DIV element for each matching element:
        let b = document.createElement("DIV");
        let imgSrc = './ICONS/profile.png'
        // insert profile pic
        b.innerHTML = "<img src='"+ imgSrc + "' class='suggestionImg'>"
        // make the matching letters bold:
        b.innerHTML += "<strong>" + userSearchArray[i].username.toString().substr(0, val.length) + "</strong>";
        b.innerHTML += userSearchArray[i].username.toString().substr(val.length);
        // insert a input field that will hold the current array item's value:
        b.innerHTML += "<input type='hidden' value='" + userSearchArray[i] + "'>";
        // execute a function when someone clicks on the item value (DIV element):
        b.addEventListener("click", (e) => {

          // TODO: go to user profile when suggestion is clicked

          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  }
})

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

// when app starts, check if token exists ( = user is already logged in )
// and show the bottomnav + logout button
if (sessionStorage.getItem('token')) {
  bottomNav.classList.remove('hidden');
  logoutButton.classList.remove('hidden');
  loginButton.classList.add('hidden');
}