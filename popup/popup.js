document.addEventListener("DOMContentLoaded", () => {
  let globalCommentSortButton = document.getElementById("globalCommentSort")
  chrome.storage.sync.get({ globalCommentSort: true }).then((result) => {
    globalCommentSortButton.checked = result.globalCommentSort
  })
  globalCommentSortButton.addEventListener("change", () => {
    chrome.storage.sync.get({ globalCommentSort: true }).then((result) => {
      chrome.storage.sync.set({ globalCommentSort: !result.globalCommentSort })
    })
  })

  let localCommentSortButton = document.getElementById("localCommentSort")
  chrome.storage.sync.get({ localCommentSort: true }).then((result) => {
    localCommentSortButton.checked = result.localCommentSort
  })
  localCommentSortButton.addEventListener("change", () => {
    chrome.storage.sync.get({ localCommentSort: true }).then((result) => {
      chrome.storage.sync.set({ localCommentSort: !result.localCommentSort })
    })
  })

  let collapseCommentButton = document.getElementById("collapseComment")
  chrome.storage.sync.get({ collapseComment: true }).then((result) => {
    collapseCommentButton.checked = result.collapseComment
  })
  collapseCommentButton.addEventListener("change", () => {
    chrome.storage.sync.get({ collapseComment: true }).then((result) => {
      chrome.storage.sync.set({ collapseComment: !result.collapseComment })
    })
  })

  let collapseCommentByDefaultButton = document.getElementById("collapseCommentByDefault")
  chrome.storage.sync.get({ collapseCommentByDefault: false }).then((result) => {
    collapseCommentByDefaultButton.checked = result.collapseCommentByDefault
  })
  collapseCommentByDefaultButton.addEventListener("change", () => {
    chrome.storage.sync.get({ collapseCommentByDefault: false }).then((result) => {
      chrome.storage.sync.set({ collapseCommentByDefault: !result.collapseCommentByDefault })
    })
  })

  let messageCommentAuthorButton = document.getElementById("messageCommentAuthor")
  chrome.storage.sync.get({ messageCommentAuthor: true }).then((result) => {
    messageCommentAuthorButton.checked = result.messageCommentAuthor
  })
  messageCommentAuthorButton.addEventListener("change", () => {
    chrome.storage.sync.get({ messageCommentAuthor: true }).then((result) => {
      chrome.storage.sync.set({ messageCommentAuthor: !result.messageCommentAuthor })
    })
  })

  let filterUserRatingInput = document.getElementById("filterCommentsBelowUserRating")
  chrome.storage.sync.get({ filterUserRating: 0 }).then((result) => {
    filterUserRatingInput.value = result.filterUserRating
  })
  filterUserRatingInput.addEventListener("input", (e) => {
    const numberRegex = /^[-+]?[0-9]+$/
    if(numberRegex.test(e.target.value)){
      filterUserRatingInput.value = e.target.value
      chrome.storage.sync.set({ filterUserRating: e.target.value })
    }
  })

  let filterCommentRatingInput = document.getElementById("filterCommentsBelowCommentRating")
  chrome.storage.sync.get({ filterCommentRating: -100000 }).then((result) => {
    filterCommentRatingInput.value = result.filterCommentRating
  })
  filterCommentRatingInput.addEventListener("input", (e) => {
    const numberRegex = /^[-+]?[0-9]+$/
    if(numberRegex.test(e.target.value)){
      filterCommentRatingInput.value = e.target.value
      chrome.storage.sync.set({ filterCommentRating: e.target.value })
    }
  })
})
