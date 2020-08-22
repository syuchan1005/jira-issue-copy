// eslint-disable-next-line import/no-extraneous-dependencies
import { browser } from 'webextension-polyfill-ts';

import {
  applyFormat,
  parentContextMenuId,
  // eslint-disable-next-line no-unused-vars
  Preset,
  resetContextMenus,
} from '../constant';

browser.runtime.onInstalled.addListener(resetContextMenus);

browser.contextMenus.onClicked.addListener(async (data) => {
  // When there is no preset.
  if (data.menuItemId === parentContextMenuId) {
    if (browser.browserAction.openPopup) {
      await browser.browserAction.openPopup();
    }
    return;
  }
  if (data.parentMenuItemId !== parentContextMenuId) return;

  // @ts-ignore
  const { presets }: { presets: Array<Preset> | undefined } = await browser.storage.local.get('presets');
  if (!Array.isArray(presets) || presets.length === 0) return;
  const preset = presets.find((p) => p.id === data.menuItemId);
  if (!preset) return;

  let issueData;
  // click on the link
  if (data.linkUrl) {
    const htmlText = await fetch(data.linkUrl)
      .then((res) => res.text())
      .catch(() => /* ignored */ '');
    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
    /* getIssueData.js */
    const numberEl = doc.querySelector('#issuekey-val');
    const numberEl2 = doc.querySelector('#key-val');
    const titleEl = doc.querySelector('#summary-val');

    if ((numberEl || numberEl2) && titleEl) {
      const issueNumber = (numberEl || numberEl2).textContent;
      const issueTitle = titleEl.textContent;

      issueData = { num: issueNumber, title: issueTitle };
    }
    /* End */
  } else {
    const res = await browser.tabs.executeScript({ file: 'getIssueData.js' })
      .catch(() => { /* ignored */ });
    if (!res || res.length < 1) return;
    // eslint-disable-next-line prefer-destructuring
    issueData = res[0];
  }

  if (!issueData) return;

  const copyText = applyFormat(preset.format, issueData);
  await browser.tabs.executeScript({
    code: `
      (() => {
        var copyFrom = document.createElement("textarea");
        copyFrom.textContent = ${JSON.stringify(copyText)};
        document.body.appendChild(copyFrom);
        copyFrom.focus();
        document.execCommand('SelectAll');
        document.execCommand('Copy');
        document.body.removeChild(copyFrom);
      })();
    `,
  }).catch(() => { /* ignored */ });
});
