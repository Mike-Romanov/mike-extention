function getCookie() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabUrl = new URL(tabs[0].url);
        const domain = tabUrl.hostname;
        document.getElementById('cookie-list').innerHTML = ''; // clear list before new data

        chrome.cookies.getAll({ domain: domain }, function (cookies) {
            cookies.forEach(function (cookie) {
                if (cookie.httpOnly) {
                    const cookieItem = document.createElement('div');
                    const cookieName = document.createElement('span');
                    const cookieValueInput = document.createElement('input');
                    const copyButton = document.createElement('button');

                    cookieName.textContent = cookie.name;
                    cookieItem.className = 'cookie-item';
                    cookieItem.appendChild(cookieName);
                    cookieItem.appendChild(cookieValueInput);
                    cookieValueInput.type = 'text';
                    cookieValueInput.value = cookie.value;
                    cookieValueInput.readOnly = true;
                    copyButton.textContent = 'Copy';
                    cookieItem.appendChild(copyButton);

                    copyButton.addEventListener('click', function () {
                        cookieValueInput.select();
                        document.execCommand('copy');
                    });
                    document.getElementById('cookie-list').appendChild(cookieItem);
                }
            })
        })
    })

}

document.getElementById('getCookies').addEventListener('click', function() {
    getCookie();
})

getCookie();