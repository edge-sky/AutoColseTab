chrome.storage.local.get(['closeTimes', 'closeNum', 'lastCloseNum', 'isBlackList'], function (data) {
    document.getElementById('closeTimes').textContent += data.closeTimes;
    document.getElementById('closeNum').textContent += data.closeNum;
    document.getElementById('lastCloseNum').textContent += data.lastCloseNum;
    if (data.isBlackList) {
        document.getElementById('listSwitch').checked = false;
        document.getElementById('displayList').innerText = '黑名单';
    } else {
        document.getElementById('listSwitch').checked = true;
        document.getElementById('displayList').innerText = '白名单';
    }
});

document.getElementById('listSwitch').addEventListener('change', function(event) {
    if (event.target.checked) {
        chrome.storage.local.set({isBlackList: false});
        document.getElementById('displayList').innerText = '白名单';
    } else {
        chrome.storage.local.set({isBlackList: true});
        document.getElementById('displayList').innerText = '黑名单';
    }
});
