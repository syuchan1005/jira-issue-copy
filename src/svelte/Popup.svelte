<main>
  <RadioButtonGroup
    title="Number format"
    items={Object.keys(formValueType.numberFormat.type)}
    bind:checked={numberFormat}
  />
  <RadioButtonGroup
    title="Divider format"
    items={Object.keys(formValueType.dividerFormat.type)}
    bind:checked={dividerFormat}
  />
  <RadioButtonGroup
    title="Title format"
    items={Object.keys(formValueType.titleFormat.type)}
    bind:checked={titleFormat}
  />
  <TextFieldWithCopy readonly value={text} on:copied={sendCopiedGA}/>
</main>

<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from 'webextension-polyfill-ts';
  import RadioButtonGroup from './RadioButtonGroup.svelte';
  import TextFieldWithCopy from './TextFieldWithCopy.svelte';

  // const
  const formValueType = {
    numberFormat: {
      type: {
        'Noop': 'NOOP',
        'Uppercase': 'UPPER',
        'Lowercase': 'LOWER',
      },
      actions: [
        (str) => str,
        (str) => str.toUpperCase(),
        (str) => str.toLowerCase(),
      ],
    },
    dividerFormat: {
      type: {
        'Empty': 'EMPTY',
        'Dash (-)': 'DASH',
        'Underscore (_)': 'UNDERSCORE',
        'Space': 'SPACE',
      },
      actions: [
        () => '',
        () => '-',
        () => '_',
        () => ' ',
      ],
    },
    titleFormat: {
      type: {
        'Noop': 'NOOP',
        'Underscore (_)': 'UNDERSCORE',
      },
      actions: [
        (str) => str,
        (str) => str.replace(/ /g, '_'),
      ],
    },
  };

  // data
  let numberFormat: number = 0;
  let dividerFormat: number = 0;
  let titleFormat: number = 0;
  let issueData = { num: '', title: '' };

  onMount(() => Promise.all([
    browser.storage.local.get(Object.keys(formValueType))
      .then((res) => {
        if (res) {
          numberFormat = res.numberFormat;
          dividerFormat = res.dividerFormat;
          titleFormat = res.titleFormat;
        }
      }),
    browser.tabs.executeScript({ file: 'getIssueData.js' })
      .then((res) => {
        if (!res || res.length < 1) return;
        issueData = res[0];
      })
      .catch(() => { /* ignored */ }),
  ]));

  // computed
  let text: string = '';
  $: {
    let str = '';
    str += formValueType.numberFormat.actions[numberFormat](issueData.num);
    str += formValueType.dividerFormat.actions[dividerFormat]();
    str += formValueType.titleFormat.actions[titleFormat](issueData.title);

    text = str;
  }

  // watch
  $: {
    browser.storage.local.set({ numberFormat, dividerFormat, titleFormat});
  }

  function sendCopiedGA() {
    const values = { numberFormat, dividerFormat, titleFormat };
    Object.keys(values).forEach((k) => {
      const gaValue = Object.values(formValueType[k].type)[values[k]];
      ga('send', {
        hitType: 'event',
        eventCategory: 'button',
        eventAction: `click_copy:${k}`,
        eventLabel: gaValue,
      });
    });
  }
</script>

<style>
    main {
        padding: 16px;
    }
</style>
