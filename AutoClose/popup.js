chrome.storage.local.get(['closeTimes', 'closeNum', 'lastCloseNum'], function (data) {
    document.getElementById('closeTimes').textContent += data.closeTimes;
    document.getElementById('closeNum').textContent += data.closeNum;
    document.getElementById('lastCloseNum').textContent += data.lastCloseNum;
});
