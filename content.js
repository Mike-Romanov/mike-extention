function getLocalStorage() {
    return Object.entries(localStorage).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getLocalStorage") {
        const data = getLocalStorage();
        sendResponse(data);
    }
});