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
        let imgSrc = url + '/uploads/profile/' + userSearchArray[i].id + '.jpg'
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