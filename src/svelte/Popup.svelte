<template>
    <main>
        <form class="ui fluid form" id="main-form">
            <div>
                <div>Number format</div>
                <div class="inline fields">
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="numberFormat" id="numberFormat-0" value="0" checked="checked">
                            <label for="numberFormat-0">Noop</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="numberFormat" id="numberFormat-1" value="1">
                            <label for="numberFormat-1">Uppercase</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="numberFormat" id="numberFormat-2" value="2">
                            <label for="numberFormat-2">Lowercase</label>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div>Divider format</div>
                <div class="inline fields">
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="dividerFormat" id="dividerFormat-0" value="0" checked="checked">
                            <label for="dividerFormat-0">Empty</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="dividerFormat" id="dividerFormat-1" value="1">
                            <label for="dividerFormat-1">Dash (-)</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="dividerFormat" id="dividerFormat-2" value="2">
                            <label for="dividerFormat-2">Underscore (_)</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="dividerFormat" id="dividerFormat-3" value="3">
                            <label for="dividerFormat-3">One space</label>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div>Title format</div>
                <div class="inline fields">
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="titleFormat" id="titleFormat-0" value="0" checked="checked">
                            <label for="titleFormat-0">Noop</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="titleFormat" id="titleFormat-1" value="1">
                            <label for="titleFormat-1">Underscore (_)</label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="ui fluid form">
            <div class="field">
                <div class="ui action input">
                    <label for="preview-input">Preview</label>
                    <input type="text" name="preview" id="preview-input" readonly>
                    <button id="copy-btn" class="ui primary button">Copy</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
  import { browser } from 'webextension-polyfill-ts';

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
        console.log(res);
        issueData = res ? JSON.parse(res) : issueData;
        renderPreviewText();
      }).catch(() => {}/* ignored */);
  });

</script>

<style>
	main {
        padding: 16px;
    }
</style>
