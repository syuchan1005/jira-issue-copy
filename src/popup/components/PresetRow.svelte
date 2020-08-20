<div class="row">
  <div class="header" on:click={() => open = !open}>
    <TextFieldWithCopy readonly name={preset.name} value={text} on:copied={sendCopiedGA}/>
    <div
      class="open-icon"
      class:closed={!open}
    >
      <div class="tri-icon"></div>
    </div>
  </div>
  <div class:none={!open} class="content">
    <button on:click={() => dispatch("click:remove")}>remove</button>
    <label>
      Name
      <input
        type="text"
        bind:value={preset.name}
        on:change={(e) => preset = { ...preset, name: e.target.value }}
      />
    </label>
    {#each formType.types as type (type)}
      <RadioButtonGroup
        title={formType.titles[type]}
        items={formType[type]}
        checked={preset.format[type]}
        on:change={(e) => preset = { ...preset, format: { ...preset.format, [type]: e.detail } }}
      />
    {/each}
  </div>
</div>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import TextFieldWithCopy from './TextFieldWithCopy.svelte';
  import RadioButtonGroup from './RadioButtonGroup.svelte';
  import {
    formType,
    Preset,
    defaultPreset,
    IssueData,
    defaultIssueData,
  } from '../constant';

  // props
  export let issueData: IssueData = defaultIssueData();
  export let preset: Preset = defaultPreset();

  // const
  const dispatch = createEventDispatcher();

  // data
  let open = false;

  // watch
  $: { dispatch('change:preset', preset); }

  // computed
  let text: string = '';
  $: {
    text = formType.types.reduce((str, type) => {
      const edited = (formType[type]
          .find(({ value }) => value === preset.format[type])
        || formType[type][0]).action(issueData)
      return `${str}${edited}`;
    }, '');
  }

  function sendCopiedGA() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'button',
      eventAction: 'click',
      eventLabel: 'copy',
    });
  }
</script>

<style>
  .row {
    margin: 8px;
  }

  .none {
    display: none;
  }

  .header {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .content {
    user-select: none;
  }

  .tri-icon {
    width: 10px;
    height: 5px;
    box-sizing: border-box;
    border-right: 5px solid transparent;
    border-bottom: 5px solid black;
    border-left: 5px solid transparent;
  }

  .open-icon {
    width: 10px;
    height: 10px;
    place-content: center;
    margin: 8px 0 8px 8px;
    transition: 0.2s;
  }

  .closed {
    transform: rotate(180deg);
  }
</style>
