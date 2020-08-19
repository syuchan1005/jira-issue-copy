/// <reference types="google.analytics" />

import { browser } from 'webextension-polyfill-ts';

import App from '../svelte/Popup.svelte';

const app = new App({
  target: document.querySelector('#main'),
});

export default app;

window.addEventListener('DOMContentLoaded', () => {
  const formValueType = {
    numberFormat: {
      type: [
        'NOOP',
        'UPPER',
        'LOWER',
      ],
      actions: [
        (str) => str,
        (str) => str.toUpperCase(),
        (str) => str.toLowerCase(),
      ],
    },
    dividerFormat: {
      type: [
        'EMPTY',
        'DASH',
        'UNDERSCORE',
        'SPACE',
      ],
      actions: [
        () => '',
        () => '-',
        () => '_',
        () => ' ',
      ],
    },
    titleFormat: {
      type: [
        'NOOP',
        'UNDERSCORE',
      ],
      actions: [
        (str) => str,
        (str) => str.replace(/ /g, '_'),
      ],
    },
  };

  const formElement = document.querySelector('#main-form');
  const previewElement: HTMLInputElement = document.querySelector('#preview-input');
  const copyElement = document.querySelector('#copy-btn');

  let issueData = { num: '', title: '' };
  const renderPreviewText = () => {
    let str = '';

    // @ts-ignore
    const numVal = parseInt(formElement.numberFormat.value, 10) || 0;
    str += formValueType.numberFormat.actions[numVal](issueData.num);

    // @ts-ignore
    const divVal = parseInt(formElement.dividerFormat.value, 10) || 0;
    str += formValueType.dividerFormat.actions[divVal]();

    // @ts-ignore
    const titleVal = parseInt(formElement.titleFormat.value, 10) || 0;
    str += formValueType.titleFormat.actions[titleVal](issueData.title);

    previewElement.value = str;
  };

  browser.storage.local.get(Object.keys(formValueType))
    .then((res) => {
      if (res) {
        Object.keys(formValueType).forEach((k) => {
          formElement[k].value = parseInt(res[k], 10) || 0;
        });
        renderPreviewText();
      }
    });
  formElement.addEventListener('change', () => {
    browser.storage.local.set(
      // @ts-ignore
      Object.fromEntries(Object.keys(formValueType)
        .map((k) => [k, formElement[k].value])),
    );
    renderPreviewText();
  });

  copyElement.addEventListener('click', () => {
    // if (!issueData.num && !issueData.title) return;
    previewElement.focus();
    previewElement.select();

    document.execCommand('Copy');

    Object.keys(formValueType).forEach((k) => {
      const value = formValueType[k]
        .type[parseInt(formElement[k].value, 10) || 0] || formValueType[k].type[0];
      ga('send', {
        hitType: 'event',
        eventCategory: 'button',
        eventAction: `click_copy:${k}`,
        eventLabel: value,
      });
    });
  });

  browser.tabs.executeScript({ file: 'getIssueData.js' })
    .then((res) => {
      // @ts-ignore
      issueData = res ? JSON.parse(res) : issueData;
      renderPreviewText();
    });
});
