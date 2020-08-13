chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'copy') {
        const numberEl = document.querySelector('#issuekey-val');
        const numberEl2 = document.querySelector('#key-val');
        const titleEl = document.querySelector('#summary-val');

        if ((numberEl || numberEl2) && titleEl) {
            const issueNumber = (numberEl || numberEl2).textContent;
            const issueTitle = titleEl.textContent;
            sendResponse(issueNumber + " " + issueTitle);
        }
    }

    return true;
});
