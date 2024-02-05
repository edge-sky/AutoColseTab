let isReady = true;

chrome.windows.onRemoved.addListener(function (windowId) {
    // close process complete
    if (isReady) {
        chrome.windows.getAll({}, function (windows) {
            if (windows.length === 0) {
                chrome.storage.local.set({newOpen: true});
                chrome.storage.local.set({lastCloseNum: 0});
            }
        });
    } else {
        setTimeout(function () {
            // waiting 0.5second
        }, 500);
    }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.status === 'complete') {
        // get state of is new tab; it sees like run more than one time, it may a problem
        chrome.storage.local.get(['newOpen', 'isBlackList', 'blackList', 'whiteList'], function (data) {
            if (isReady && data.newOpen && tab.active) {
                isReady = false;
                // set state of new tab
                chrome.storage.local.set({newOpen: false});

                chrome.tabs.query({currentWindow: true}, function (tabs) {
                    if (data.isBlackList) {
                        // black list mode
                        for (let i = 0; i < tabs.length; i++) {
                            for (let j = 0; j < data.blackList.length; j++) {
                                if (tabs[i].id !== tab.id && !matchDomain(data.blackList[j], tabs[i].url)) {
                                    chrome.tabs.remove(tabs[i].id);
                                }
                            }
                        }
                    } else {
                        // white list mode
                        for (let i = 0; i < tabs.length; i++) {
                            for (let j = 0; j < data.whiteList.length; j++) {
                                if (tabs[i].id !== tab.id && matchDomain(data.whiteList[j], tabs[i].url)) {
                                    chrome.tabs.remove(tabs[i].id);
                                }
                            }
                        }
                    }

                    chrome.storage.local.set({lastCloseNum: tabs.length - 1});
                    chrome.storage.local.get('closeTimes', function (data) {
                        chrome.storage.local.set({closeTimes: data.closeTimes + 1});
                    });
                    chrome.storage.local.get('closeNum', function (data) {
                        chrome.storage.local.set({closeNum: data.closeNum + tabs.length - 1});
                    });
                });
                isReady = true;
            }
        });
    }
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({
        newOpen: true,
        closeTimes: 0,
        closeNum: 0,
        lastCloseNum: 0,
        isBlackList: true,
        blackList: [],
        whiteList: [],
    });
});

// Url domain match
function matchDomain(domainUrl, matchedUrl) {
    let regex = new RegExp('^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)', 'im');
    let match = domainUrl.match(regex);
    if (match && match[1]) {
        return matchedUrl.includes(match[1]);
    }
    return false;
}
