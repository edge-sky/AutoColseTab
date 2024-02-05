chrome.storage.local.get(['closeTimes', 'closeNum', 'lastCloseNum', 'isBlackList'], function (data) {
    document.getElementById('closeTimes').textContent += data.closeTimes;
    document.getElementById('closeNum').textContent += data.closeNum;
    document.getElementById('lastCloseNum').textContent += data.lastCloseNum;
    if (data.isBlackList) {
        document.getElementById('listSwitch').checked = false;
        document.getElementById('displayList').innerText = '黑名单';
        document.getElementById('tip').innerText = 'Tips: 以下网址会被关闭';
    } else {
        document.getElementById('listSwitch').checked = true;
        document.getElementById('displayList').innerText = '白名单';
        document.getElementById('tip').innerText = 'Tips: 以下网址不会被关闭';
    }
});

document.getElementById('listSwitch').addEventListener('change', function (event) {
    if (event.target.checked) {
        chrome.storage.local.set({isBlackList: false});
        document.getElementById('displayList').innerText = '白名单';
        document.getElementById('tip').innerText = 'Tips: 以下网址不会被关闭';
    } else {
        chrome.storage.local.set({isBlackList: true});
        document.getElementById('displayList').innerText = '黑名单';
        document.getElementById('tip').innerText = 'Tips: 以下网址会被关闭';
    }
    displayList();
});

document.querySelector('#setting_option').addEventListener('click', function (event) {
    displayList();
    // 隐藏id为"main"的元素
    document.querySelector('#main').style.display = 'none';
    // 显示新的元素
    document.querySelector('#setting').style.display = 'block';
});

document.querySelector('#back_button').addEventListener('click', function (event) {
    // 隐藏id为"main"的元素
    document.querySelector('#setting').style.display = 'none';
    // 显示新的元素
    document.querySelector('#main').style.display = 'block';
});

function displayList() {
    chrome.storage.local.get(['isBlackList', 'blackList', 'whiteList'], function (data) {
        let list = data.isBlackList ? data.blackList : data.whiteList;
        let listElement = document.getElementById('list');
        listElement.innerHTML = '';
        for (let i = 0; i < list.length; i++) {
            let listItem = document.createElement('div');
            let deleteButton = document.createElement('button');
            deleteButton.textContent = '-';
            deleteButton.addEventListener('click', function () {
                // 从列表中删除对应的项
                list.splice(i, 1);
                // 更新存储的列表
                if (data.isBlackList) {
                    chrome.storage.local.set({blackList: list});
                } else {
                    chrome.storage.local.set({whiteList: list});
                }
                // 重新显示列表
                displayList();
            });

            listItem.style.width = '140px';
            deleteButton.style.width = '25px';

            listItem.textContent = list[i];
            listItem.appendChild(deleteButton);
            listElement.appendChild(listItem);
        }

        let addElement = document.createElement('div');
        let inputElement = document.createElement('input');
        let addButton = document.createElement('button');
        addButton.textContent = '+';

        inputElement.style.width = '140px';
        addButton.style.width = '25px';
        inputElement.id = 'input';
        addButton.onclick = function () {
            let value = inputElement.value;
            if (value) {
                list.push(value);
                if (data.isBlackList) {
                    chrome.storage.local.set({blackList: list});
                } else {
                    chrome.storage.local.set({whiteList: list});
                }
                displayList();
            }
        };

        addElement.appendChild(inputElement);
        addElement.appendChild(addButton);

        // add to the end
        listElement.appendChild(addElement);
    });
}
