function commentFunctions(){
  const comments = document.querySelectorAll("div.comment:not(div.comment-reply-prototype)")

  let userHandles = ""
  const userRatings = {}
  for(const comment of comments){
    const userId = comment.getElementsByClassName("avatar")[0].firstElementChild.getAttribute("href").split("/").pop()
    userHandles += userId + ";"
  }

  fetch("https://codeforces.com/api/user.info?handles=" + userHandles).then(response => response.json()).then(result => {
    if(result.status == "OK"){
      for(const user of result.result){
        if("rating" in user){
          userRatings[user.handle] = user.rating
        }
        else{
          userRatings[user.handle] = 0
        }
      }
    }
  })
  .finally(() => {
    chrome.storage.sync.get({ filterUserRating: 0 }).then((userRatingResult) => {
      chrome.storage.sync.get({ filterCommentRating: -100000 }).then((commentRatingResult) => {
        let displayedComments = 0

        for (const comment of comments){
          const userId = comment.getElementsByClassName("avatar")[0].firstElementChild.getAttribute("href").split("/").pop()
          const commentRating = comment.getElementsByClassName("CommentVoteFrame")[0].getAttribute("data-commentrating")
          
          let skippedComment = false

          if(parseInt(userRatings[userId]) < parseInt(userRatingResult.filterUserRating) || parseInt(commentRating) < parseInt(commentRatingResult.filterCommentRating)){
            skippedComment = true
          }

          if(skippedComment){
            comment.style.display = "none"
            continue
          }
          else{
            displayedComments += 1
            comment.style.removeProperty("display")
          }

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
          sortButton.classList.add("sortButton")
          sortButton.dataset.sort = "0"
      
          sortButton.appendChild(sortImg)
          
          sortButton.addEventListener("click", function(){
            const sortState = sortButton.dataset.sort
      
            if(sortState == "0"){
              sortImg.src = chrome.runtime.getURL("assets/arrow-trending-down.svg")
              sortImg.style.opacity = "1"
              sortButton.dataset.sort = "1"
      
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
            else if(sortState == "1"){
              sortImg.src = chrome.runtime.getURL("assets/arrow-trending-up.svg")
              sortButton.dataset.sort = "2"
      
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
            else{
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
          collapseButton.classList.add("collapseButton")
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
          messageButton.classList.add("messageButton")
      
          messageButton.appendChild(messageImg)
      
          messageButton.addEventListener("click", function(){
            const userId = comment.getElementsByClassName("avatar")[0].firstElementChild.getAttribute("href").split("/").pop()
            window.location.href = "https://codeforces.com/usertalk?other=" + userId
          })
      
          const newButtons = document.createElement("div")
          newButtons.classList.add("newLocalButtons")
      
          if(subcommentData.length > 0){
            chrome.storage.sync.get({ localCommentSort: true }).then((result) => {
              if(result.localCommentSort === true){
                newButtons.appendChild(sortButton)
              }
            })
            chrome.storage.sync.get({ collapseComment: true }).then((result) => {
              if(result.collapseComment === true){
                newButtons.appendChild(collapseButton)
              }
            })
            chrome.storage.sync.get({ collapseCommentByDefault: false }).then((result) => {
              if(result.collapseCommentByDefault === true){
                collapseImg.src = chrome.runtime.getURL('assets/chevron-right.svg')
                sortButton.dataset.show = "0"
        
                subcommentContainer.style.display = "none"
              }
            })
          }
      
          chrome.storage.sync.get({ messageCommentAuthor: true }).then((result) => {
            if(result.messageCommentAuthor === true){
              newButtons.appendChild(messageButton)
            }
          })
      
          comment.firstElementChild.firstElementChild.firstElementChild.firstElementChild.children[0].insertAdjacentElement("afterend", newButtons)
        }

        const commentsTitle = document.querySelector('[name="comments"]')
        // technical issue, hidden subcomments are counted
        // commentsTitle.innerText = commentsTitle.innerText.replace("(", "(" + displayedComments.toString() + "/")
      })
    })
  })
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
  sortButton.classList.add("globalSortButton")
  sortButton.dataset.sort = "0"

  sortButton.appendChild(sortImg)
  
  sortButton.addEventListener("click", function(){
    const sortState = sortButton.dataset.sort

    if(sortState == "0"){
      sortImg.src = chrome.runtime.getURL("assets/arrow-trending-down.svg")
      sortImg.style.opacity = "1"
      sortButton.dataset.sort = "1"

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
    else if(sortState == "1"){
      sortImg.src = chrome.runtime.getURL("assets/arrow-trending-up.svg")
      sortButton.dataset.sort = "2"

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
    else{
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
  newButtons.classList.add("newGlobalButtons")

  if(commentData.length > 0){
    chrome.storage.sync.get({ globalCommentSort: true }).then((result) => {
      if(result.globalCommentSort === true){
        newButtons.appendChild(sortButton)
      }
    })
  }

  comments.firstElementChild.firstElementChild.children[1].insertAdjacentElement("afterend", newButtons)
}

commentFunctions()
globalFunctions()
