const sortButtons = async () => {
  const sortButtonDiv = document.createElement('div');
  if(!document.getElementById('sort-button-div')) {
    sortButtonDiv.id = 'sort-button-div'
  }
  const topSortButtonDiv = document.createElement('div');
  topSortButtonDiv.id = 'top-sort-button-div'
  const bottomSortButtonDiv = document.createElement('div');
  bottomSortButtonDiv.id = 'bottom-sort-button-div'

  const topLiked = document.createElement('button')
  topLiked.innerText = "Most liked"
  topLiked.id = 'top-liked-button'
  topLiked.className = 'top-sort-buttons'
  const topDisliked = document.createElement('button')
  topDisliked.innerText = "Most disliked"
  topDisliked.id = 'top-disliked-button'
  topDisliked.className = 'top-sort-buttons'
  const mostComments = document.createElement('button')
  mostComments.innerText = "Most comments"
  mostComments.id = 'top-comments-button'
  mostComments.className = 'top-sort-buttons'

  const sortOptions = (selector) => {
    topLiked.classList.remove('selected')
    topDisliked.classList.remove('selected')
    mostComments.classList.remove('selected')

    selector.classList.add('selected')
    bottomSortButtonDiv.innerHTML = '';

    const daySort = document.createElement('button');
    daySort.innerText = 'Today';
    daySort.className = 'bottom-sort-buttons'
    const weekSort = document.createElement('button')
    weekSort.innerText = 'This week';
    weekSort.className = 'bottom-sort-buttons'
    const monthSort = document.createElement('button');
    monthSort.innerText = 'This month';
    monthSort.className = 'bottom-sort-buttons'
    const yearSort = document.createElement('button');
    yearSort.innerText = 'This year';
    yearSort.className = 'bottom-sort-buttons'
    const allTimeSort = document.createElement('button');
    allTimeSort.innerText = 'All time';
    allTimeSort.className = 'bottom-sort-buttons'

    daySort.addEventListener('click', async () => {
      selector.classList.remove('selected')
      bottomSortButtonDiv.innerHTML = ''

      if(selector.id === 'top-liked-button') {
        const response = await fetch(url + '/post/getby/topLikes/since/today');
        const posts = await response.json();
        await createPosts(posts)
      }
      if(selector.id === 'top-disliked-button') {
        const response = await fetch(url + '/post/getby/topDislikes/since/today')
        const posts = await response.json();
        await createPosts(posts)
      }
      if(selector.id === 'top-comments-button') {
        const response = await fetch(url + '/post/getby/mostComments/since/today')
        const posts = await response.json();
        await createPosts(posts)
      }
    })

    weekSort.addEventListener('click', async () => {
      selector.classList.remove('selected')
      bottomSortButtonDiv.innerHTML = ''

      if(selector.id === 'top-liked-button') {
        const response = await fetch(url + '/post/getby/topLikes/since/week');
        const posts = await response.json();
        await createPosts(posts)
      }
      if(selector.id === 'top-disliked-button') {
        const response = await fetch(url + '/post/getby/topDislikes/since/week')
        const posts = await response.json();
        await createPosts(posts)
      }
      if(selector.id === 'top-comments-button') {
        const response = await fetch(url + '/post/getby/mostComments/since/week')
        const posts = await response.json();
        await createPosts(posts)
      }
    })

    monthSort.addEventListener('click', async () => {
      selector.classList.remove('selected')
      bottomSortButtonDiv.innerHTML = ''

      if(selector.id === 'top-liked-button') {
        const response = await fetch(url + '/post/getby/topLikes/since/month');
        const posts = await response.json();
        await createPosts(posts)
      }
      if(selector.id === 'top-disliked-button') {
        const response = await fetch(url + '/post/getby/topDislikes/since/month')
        const posts = await response.json();
        await createPosts(posts)
      }
      if(selector.id === 'top-comments-button') {
        const response = await fetch(url + '/post/getby/mostComments/since/month')
        const posts = await response.json();
        await createPosts(posts)
      }
    })

    yearSort.addEventListener('click', async () => {
      selector.classList.remove('selected')
      bottomSortButtonDiv.innerHTML = ''

      if(selector.id === 'top-liked-button') {
        const response = await fetch(url + '/post/getby/topLikes/since/year');
        const posts = await response.json();
        await createPosts(posts)
      }
      if(selector.id === 'top-disliked-button') {
        const response = await fetch(url + '/post/getby/topDislikes/since/year')
        const posts = await response.json();
        await createPosts(posts)
      }
      if(selector.id === 'top-comments-button') {
        const response = await fetch(url + '/post/getby/mostComments/since/year')
        const posts = await response.json();
        await createPosts(posts)
      }
    })

    allTimeSort.addEventListener('click', async () => {
      selector.classList.remove('selected')
      bottomSortButtonDiv.innerHTML = ''

      if(selector.id === 'top-liked-button') {
        const response = await fetch(url + '/post/getby/topLikes/since/all');
        const posts = await response.json();
        console.dir(posts)
        await createPosts(posts)
      }
      if(selector.id === 'top-disliked-button') {
        const response = await fetch(url + '/post/getby/topDislikes/since/all')
        const posts = await response.json();
        await createPosts(posts)
      }
      if(selector.id === 'top-comments-button') {
        const response = await fetch(url + '/post/getby/mostComments/since/all')
        const posts = await response.json();
        console.dir(posts)
        await createPosts(posts)
      }
    })

    bottomSortButtonDiv.appendChild(daySort)
    bottomSortButtonDiv.appendChild(weekSort)
    bottomSortButtonDiv.appendChild(monthSort)
    bottomSortButtonDiv.appendChild(yearSort)
    bottomSortButtonDiv.appendChild(allTimeSort)
  }

  topLiked.addEventListener('click', () => {
    sortOptions(topLiked)
  })
  topDisliked.addEventListener('click', () => {
    sortOptions(topDisliked)
  })
  mostComments.addEventListener('click', () => {
    sortOptions(mostComments)
  })

  topSortButtonDiv.appendChild(topLiked)
  topSortButtonDiv.appendChild(topDisliked)
  topSortButtonDiv.appendChild(mostComments)
  sortButtonDiv.appendChild(topSortButtonDiv)
  sortButtonDiv.appendChild(bottomSortButtonDiv)

  main.appendChild(sortButtonDiv)
}