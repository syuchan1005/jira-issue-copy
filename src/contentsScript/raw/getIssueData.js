// The same thing is in background.js

// eslint-disable-next-line consistent-return
(() => {
  const numberEl = document.querySelector('#issuekey-val');
  const numberEl2 = document.querySelector('#key-val');
  const titleEl = document.querySelector('#summary-val');

  if ((numberEl || numberEl2) && titleEl) {
    const issueNumber = (numberEl || numberEl2).textContent;
    const issueTitle = titleEl.textContent;

    return { num: issueNumber, title: issueTitle };
  }
})();
