let isReady = false;


chrome.windows.onRemoved.addListener(function (windowId) {
    // close process complete
    if (isReady) {
        chrome.windows.getAll({}, function (windows) {
            if (windows.length === 0) {
                chrome.storage.local.set({newOpen: true});
            }
        });
    } else {
        // waiting when not ready
        setTimeout(function () {
            isReady = true;
        }, 500);
    }
});

chrome.tabs.onCreated.addListener(function (tab) {
    try {
        // get state of is new tab; it sees like run more than one time, it may a problem
        chrome.storage.local.get('newOpen', function (data) {
            if (data.newOpen) {
                // close all tab except new tab
                chrome.tabs.query({}, function (tabs) {
                    for (let i = 0; i < tabs.length; i++) {
                        if (tabs[i].id !== tab.id && tabs[i].url !== 'edge://newtab/') {
                            chrome.tabs.remove(tabs[i].id);
                        }
                    }
                });
                // set state of new tab
                chrome.storage.local.set({newOpen: false});
            }
            isReady = true;
        });
    } catch (e) {
        console.log(e);
    }
});