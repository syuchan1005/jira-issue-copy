window.addEventListener('DOMContentLoaded', () => {
    let issueData = { num: '', title: '' };

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', action: 'getIssueData' }, (res) => {
            issueData = res || issueData;
        });
    });

    document.querySelector('#button').addEventListener('click', () => {
        const input = document.createElement('textarea');

        document.body.appendChild(input);
        input.value = `${issueData.num} ${issueData.title}`;
        input.focus();
        input.select();

        document.execCommand('Copy');
        input.remove();
    });
});
