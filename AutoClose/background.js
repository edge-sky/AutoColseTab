let isReady = false;

chrome.alarms.create('keepAlive', {periodInMinutes: 1.5});


chrome.windows.onRemoved.addListener(function (windowId) {
    // close process complete
    if (isReady) {
        chrome.windows.getAll({}, function (windows) {
            if (windows.length === 0) {
                chrome.storage.local.set({newOpen: true});
            }
        });
    } else {
        setTimeout(function () {
            // waiting 0.5second
        }, 500);
    }
});

chrome.tabs.onCreated.addListener(function (tab) {
    try {
        // get state of is new tab; it sees like run more than one time, it may a problem
        chrome.storage.local.get('newOpen', function (data) {
            if (data.newOpen) {
                // set state of new tab
                chrome.storage.local.set({newOpen: false});
                // close tab except new tab
                if (tab.url !== '') {
                    chrome.tabs.remove(tab.id);
                }

            }
        });
    } catch (e) {
        console.log(e);
    }
    isReady = true;
});