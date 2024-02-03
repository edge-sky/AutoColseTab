chrome.storage.local.get(['closeTimes', 'closeNum', 'lastCloseNum'], function (data) {
    document.getElementById('closeTimes').textContent += data.closeTimes;
    document.getElementById('closeNum').textContent += data.closeNum;
    document.getElementById('lastCloseNum').textContent += data.lastCloseNum;
});

document.getElementById('listSwitch').addEventListener('change', function(event) {
    if (event.target.value.equals('blackList')) {
        chrome.storage.local.set({isBlackList: true});
    } else {
        chrome.storage.local.set({isBlackList: false});
    }
});
