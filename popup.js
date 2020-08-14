window.addEventListener('DOMContentLoaded', () => {
    const formElement = document.querySelector('#main-form');
    const formValueKeys = ['numberFormat', 'dividerFormat', 'titleFormat'];
    const previewElement = document.querySelector('#preview-input');
    const copyElement = document.querySelector('#copy-btn');

    chrome.storage.local.get(formValueKeys, (res) => {
        if (res) {
            formValueKeys.forEach((k) => {
                formElement[k].value = res[k];
            });
            renderPreviewText();
        }
    });

    let issueData = {num: '', title: ''};
    const renderPreviewText = () => {
        let str = '';
        switch (formElement.numberFormat.value) {
            case 'UPPER':
                str += issueData.num.toUpperCase();
                break;
            case 'LOWER':
                str += issueData.num.toLowerCase();
                break;
            case 'NOOP':
            default:
                str += issueData.num;
                break;
        }

        switch (formElement.dividerFormat.value) {
            case 'DASH':
                str += '-';
                break;
            case 'UNDERSCORE':
                str += '_';
                break;
            case 'SPACE':
                str += ' ';
                break;
            // case 'EMPTY':
        }

        switch (formElement.titleFormat.value) {
            case 'UNDERSCORE':
                str += issueData.title.replace(/ /g, '_');
                break;
            case 'NOOP':
            default:
                str += issueData.title;
                break;
        }

        previewElement.value = str;
    };
    formElement.addEventListener('change', () => {
        chrome.storage.local.set(
            Object.fromEntries(formValueKeys.map((k) => [k, formElement[k].value])),
        );
        renderPreviewText();
    });

    chrome.tabs.executeScript(
        {file: 'getIssueData.js'},
        (res) => {
            issueData = JSON.parse(res) || issueData;
            renderPreviewText();
        },
    );

    copyElement.addEventListener('click', () => {
        const input = document.createElement('textarea');

        document.body.appendChild(input);
        input.value = previewElement.value;
        input.focus();
        input.select();

        document.execCommand('Copy');
        input.remove();
    });
});
