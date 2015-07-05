(function(chrome) {
    chrome.runtime.onInstalled.addListener(function() {
        chrome.storage.sync.get('highlighter', function(value) {
            if (value.highlighter === undefined || (value.highlighter !== undefined && value.highlighter === null)) {
                chrome.storage.sync.set({ 'highlighter': '#fcf8e3' });
            }
        });
    });

    chrome.tabs.onUpdated.addListener(function(tabId) {
        chrome.pageAction.show(tabId);
    });
})(chrome);
