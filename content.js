chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getIssueData') {
        const numberEl = document.querySelector('#issuekey-val');
        const numberEl2 = document.querySelector('#key-val');
        const titleEl = document.querySelector('#summary-val');

        if ((numberEl || numberEl2) && titleEl) {
            const issueNumber = (numberEl || numberEl2).textContent;
            const issueTitle = titleEl.textContent;

            sendResponse({ num: issueNumber, title: issueTitle });
        } else {
            sendResponse(null);
        }
    }

    return true;
});
