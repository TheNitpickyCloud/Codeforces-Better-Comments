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
})