chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (tab.url.indexOf('https://twitter.com/') == -1) return
  if (info.status != 'complete') return
  chrome.scripting.executeScript({ target: { tabId }, files: ['flatpickr.js', 'content.js'] })
})
