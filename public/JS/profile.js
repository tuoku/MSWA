const usernameField = document.getElementById('username');
const followerAmountField = document.getElementById('followerAmount');


let mUser


// get the requested users id from url params
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get('id');

const init = async () => {
  const response = await fetch(url + '/user/' + userId)
  const user = await response.json()
  mUser = user[0]
}

init().then( () => {
  usernameField.innerHTML = `<strong> ${mUser.username} </strong>`
  followerAmountField.innerHTML = `<strong> ${mUser.followers} </strong> <br> followers`
})


