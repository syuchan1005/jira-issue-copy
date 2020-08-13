chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { action: 'copy' }, (str) => {
        if (!str) return;

        const input = document.createElement('textarea');

        document.body.appendChild(input);
        input.value = str;
        input.focus();
        input.select();

        document.execCommand('Copy');
        input.remove();
    });

    return true;
});
