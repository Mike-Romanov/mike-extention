function getCookie() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabUrl = new URL(tabs[0].url);
        const domain = tabUrl.hostname;

        const cookieList = document.getElementById('cookie-list');
        cookieList.innerHTML = '';

        chrome.cookies.getAll({ domain: domain }, function (cookies) {
            if (!cookies.length) return

            const fragment = document.createDocumentFragment();
            cookies.forEach(function (cookie) {
                if (cookie.httpOnly) {
                    fragment.appendChild(createDisplayItem(cookie));
                }
            });

            cookieList.appendChild(fragment);
        });
    });
}

function getLocalStoradge() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        // Send a message to the content script to retrieve localStorage data
        chrome.tabs.sendMessage(tabId, { action: 'getLocalStorage' }, (response) => {
            const localStorageList = document.getElementById('localStorage-list');
            localStorageList.innerHTML = '';

            if (!response) return;

            if (response.cart) {
                const basket = JSON.parse(response.cart);
                appendLocalStorageData(localStorageList, 'basket', basket.basketId);

                basket.items.forEach((item, index) => {
                    appendLocalStorageData(localStorageList, 'product_' + index, item.productId);
                });
            }
        });
    });
}

function appendLocalStorageData(container, name, value) {
    const data = { name: name, value: value };
    container.appendChild(createDisplayItem(data));
}

// Utility function to create an item for display
function createDisplayItem(data) {
    const item = document.createElement('div');
    item.className = 'cookie-item';

    const name = document.createElement('span');
    name.textContent = data.name || '';
    item.appendChild(name);

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.value = data.value || '';
    valueInput.readOnly = true;
    item.appendChild(valueInput);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    item.appendChild(copyButton);

    copyButton.addEventListener('click', function () {
        valueInput.select();
        document.execCommand('copy');
        showCopiedNotification();
    });

    return item;
}

function showCopiedNotification() {
    const notification = document.createElement('div');
    notification.textContent = 'Copied to clipboard!';
    notification.className = 'copy-notification';
    document.body.appendChild(notification);

    // Remove notification after 2 seconds
    setTimeout(() => notification.remove(), 2000);
}

document.getElementById('refresh').addEventListener('click', function () {
    getCookie();
    getLocalStoradge();
});

getCookie();
getLocalStoradge();
