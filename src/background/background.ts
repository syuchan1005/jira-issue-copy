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
  if (data.parentMenuItemId !== parentContextMenuId) return;

  // @ts-ignore
  const { presets }: { presets: Array<Preset> | undefined } = await browser.storage.local.get('presets');
  if (!Array.isArray(presets) || presets.length === 0) return;
  const preset = presets.find((p) => p.id === data.menuItemId);
  if (!preset) return;

  const res = await browser.tabs.executeScript({ file: 'getIssueData.js' })
    .catch(() => { /* ignored */ });
  if (!res || res.length < 1) return;

  const copyText = applyFormat(preset.format, res[0]);
  await browser.tabs.executeScript({
    // language=Javascript
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
