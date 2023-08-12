function commentFunctions(){
  const comments = document.querySelectorAll("div.comment")

  for (const comment of comments){
    const subcommentContainer = comment.getElementsByTagName("ul")[0]
    const subcommentData = []

    if(subcommentContainer === undefined){
      continue
    }

    for (const subcomment of subcommentContainer.children){
      if(subcomment.getElementsByClassName("CommentVoteFrame").length > 0){
        const subcommentId = subcomment.getElementsByClassName("CommentVoteFrame")[0].getAttribute("commentid")
        const subcommentRating = subcomment.getElementsByClassName("CommentVoteFrame")[0].getAttribute("data-commentrating")
        subcommentData.push({subcomment: subcomment, subcommentId: subcommentId, subcommentRating: subcommentRating})
      }
    }

    const sortImg = document.createElement("img")
    sortImg.src = chrome.runtime.getURL("assets/arrow-trending-up.svg")
    sortImg.style.opacity = "0.25"

    const sortButton = document.createElement("button")
    sortButton.style.all = "unset"
    sortButton.style.cursor = "pointer"
    sortButton.style.width = "30px"
    sortButton.style.height = "30px"
    sortButton.dataset.sort = "0"

    sortButton.appendChild(sortImg)
    
    sortButton.addEventListener("click", function(){
      const sortState = sortButton.dataset.sort

      if(sortState == "0"){
        sortImg.style.opacity = "1"
        sortButton.dataset.sort = "1"

        // sort in ascending order
        subcommentData.sort((a, b) => {
          if(parseInt(a.subcommentRating) < parseInt(b.subcommentRating)){
            return -1
          }
          else if(parseInt(a.subcommentRating) == parseInt(b.subcommentRating)){
            return 0
          }
          else{
            return 1
          }
        })

        subcommentContainer.replaceChildren(...(subcommentData.map(elem => elem.subcomment)))
      }
      else if(sortState == "1"){
        sortImg.src = chrome.runtime.getURL("assets/arrow-trending-down.svg")
        sortButton.dataset.sort = "2"

        // sort in descending order
        subcommentData.sort((a, b) => {
          if(parseInt(a.subcommentRating) < parseInt(b.subcommentRating)){
            return 1
          }
          else if(parseInt(a.subcommentRating) == parseInt(b.subcommentRating)){
            return 0
          }
          else{
            return -1
          }
        })

        subcommentContainer.replaceChildren(...(subcommentData.map(elem => elem.subcomment)))
      }
      else{
        sortImg.src = chrome.runtime.getURL("assets/arrow-trending-up.svg")
        sortImg.style.opacity = "0.25"
        sortButton.dataset.sort = "0"

        // reset sort (ascending commentid)
        subcommentData.sort((a, b) => {
          if(parseInt(a.subcommentId) < parseInt(b.subcommentId)){
            return -1
          }
          else if(parseInt(a.subcommentId) == parseInt(b.subcommentId)){
            return 0
          }
          else{
            return 1
          }
        })

        subcommentContainer.replaceChildren(...(subcommentData.map(elem => elem.subcomment)))
      }
    })

    const collapseImg = document.createElement("img")
    collapseImg.src = chrome.runtime.getURL('assets/chevron-down.svg')

    const collapseButton = document.createElement("button")
    collapseButton.style.all = "unset"
    collapseButton.style.cursor = "pointer"
    collapseButton.style.width = "25px"
    collapseButton.style.height = "25px"
    collapseButton.dataset.show = "1"

    collapseButton.appendChild(collapseImg)

    collapseButton.addEventListener("click", function(){
      const collapseState = sortButton.dataset.show

      if(collapseState == "0"){
        collapseImg.src = chrome.runtime.getURL('assets/chevron-down.svg')
        sortButton.dataset.show = "1"

        subcommentContainer.style.removeProperty("display")
      }
      else{
        collapseImg.src = chrome.runtime.getURL('assets/chevron-right.svg')
        sortButton.dataset.show = "0"

        subcommentContainer.style.display = "none"
      }
    })

    const messageImg = document.createElement("img")
    messageImg.src = chrome.runtime.getURL('assets/envelope.svg')

    const messageButton = document.createElement("button")
    messageButton.style.all = "unset"
    messageButton.style.cursor = "pointer"
    messageButton.style.width = "25px"
    messageButton.style.height = "25px"

    messageButton.appendChild(messageImg)

    const userId = comment.getElementsByClassName("avatar")[0].firstElementChild.getAttribute("href").split("/").pop()

    messageButton.addEventListener("click", function(){
      window.location.href = "https://codeforces.com/usertalk?other=" + userId
    })

    const newButtons = document.createElement("div")
    newButtons.style.position = "relative"
    newButtons.style.zIndex = "1"
    newButtons.style.marginBottom = "8px"
    newButtons.style.display = "flex"
    newButtons.style.gap = "5px"
    newButtons.style.justifyContent = "center"
    newButtons.style.alignItems = "center"

    newButtons.appendChild(sortButton)
    newButtons.appendChild(collapseButton)
    newButtons.appendChild(messageButton)

    comment.firstElementChild.firstElementChild.firstElementChild.firstElementChild.children[0].insertAdjacentElement("afterend", newButtons)
  }
}

function globalFunctions(){
  const comments = document.querySelector("div.comments")
  const commentData = []

  for (const comment of comments.children){
    if(comment.getElementsByClassName("CommentVoteFrame").length > 0){
      const commentId = comment.getElementsByClassName("CommentVoteFrame")[0].getAttribute("commentid")
      const commentRating = comment.getElementsByClassName("CommentVoteFrame")[0].getAttribute("data-commentrating")
      commentData.push({comment: comment, commentId: commentId, commentRating: commentRating})
    }
  }

  const sortImg = document.createElement("img")
  sortImg.src = chrome.runtime.getURL("assets/arrow-trending-up.svg")
  sortImg.style.opacity = "0.25"

  const sortButton = document.createElement("button")
  sortButton.style.all = "unset"
  sortButton.style.cursor = "pointer"
  sortButton.style.width = "40px"
  sortButton.style.height = "40px"
  sortButton.dataset.sort = "0"

  sortButton.appendChild(sortImg)
  
  sortButton.addEventListener("click", function(){
    const sortState = sortButton.dataset.sort

    if(sortState == "0"){
      sortImg.style.opacity = "1"
      sortButton.dataset.sort = "1"

      // sort in ascending order
      commentData.sort((a, b) => {
        if(parseInt(a.commentRating) < parseInt(b.commentRating)){
          return -1
        }
        else if(parseInt(a.commentRating) == parseInt(b.commentRating)){
          return 0
        }
        else{
          return 1
        }
      })

      // need to reverse cause of how insertAdjacentElement works
      commentData.reverse()

      while(comments.querySelectorAll('div.comment').length > 0){
        comments.querySelectorAll('div.comment')[0].remove()
      }

      for (const comment of commentData){
        comments.children[0].insertAdjacentElement("afterend", comment.comment)
      }
    }
    else if(sortState == "1"){
      sortImg.src = chrome.runtime.getURL("assets/arrow-trending-down.svg")
      sortButton.dataset.sort = "2"

      // sort in descending order
      commentData.sort((a, b) => {
        if(parseInt(a.commentRating) < parseInt(b.commentRating)){
          return 1
        }
        else if(parseInt(a.commentRating) == parseInt(b.commentRating)){
          return 0
        }
        else{
          return -1
        }
      })

      // need to reverse cause of how insertAdjacentElement works
      commentData.reverse()

      while(comments.querySelectorAll('div.comment').length > 0){
        comments.querySelectorAll('div.comment')[0].remove()
      }

      for (const comment of commentData){
        comments.children[0].insertAdjacentElement("afterend", comment.comment)
      }
    }
    else{
      sortImg.src = chrome.runtime.getURL("assets/arrow-trending-up.svg")
      sortImg.style.opacity = "0.25"
      sortButton.dataset.sort = "0"

      // reset sort (ascending commentid)
      commentData.sort((a, b) => {
        if(parseInt(a.commentId) < parseInt(b.commentId)){
          return -1
        }
        else if(parseInt(a.commentId) == parseInt(b.commentId)){
          return 0
        }
        else{
          return 1
        }
      })

      // need to reverse cause of how insertAdjacentElement works
      commentData.reverse()

      while(comments.querySelectorAll('div.comment').length > 0){
        comments.querySelectorAll('div.comment')[0].remove()
      }

      for (const comment of commentData){
        comments.children[0].insertAdjacentElement("afterend", comment.comment)
      }
    }
  });

  const newButtons = document.createElement("div")
  newButtons.style.display = "inline-flex"
  newButtons.style.marginLeft = "15px"
  newButtons.style.position = "relative"
  newButtons.style.top = "0.4em"
  newButtons.style.justifyContent = "left"
  newButtons.style.alignItems = "center"

  newButtons.appendChild(sortButton)

  comments.firstElementChild.firstElementChild.children[1].insertAdjacentElement("afterend", newButtons)
}

commentFunctions()
globalFunctions()
