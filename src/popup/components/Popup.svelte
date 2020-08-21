<main>
  {#each presets as preset, i (i)}
    <PresetRow
      bind:issueData
      bind:preset={preset}
      on:change:preset={(e) => {
        const p = [...presets];
        p[i] = e.detail;
        setPresets(p);
      }}
      on:click:remove={() => {
        const p = [...presets];
        p.splice(i, 1);
        setPresets(p);
      }}
    />
    <Divider />
  {/each}

  <div class="add">
    <button on:click={() => setPresets([...presets, defaultPreset()])}>Add</button>
  </div>
</main>

<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from 'webextension-polyfill-ts';
  import PresetRow from './PresetRow.svelte';
  import Divider from './Divider.svelte';

  import {
    IssueData,
    defaultIssueData,
    Preset,
    defaultPreset,
  } from '../constant';

  // data
  let issueData: IssueData = defaultIssueData();
  let presets: Array<Preset> = [];

  onMount(() => Promise.all([
    browser.storage.local.get('presets')
      .then((res) => {
        const { presets: p } = res;
        presets = Array.isArray(p) ? p : [];
      }),
    browser.tabs.executeScript({ file: 'getIssueData.js' })
      .then((res) => {
        if (!res || res.length < 1) return;
        issueData = res[0] || defaultIssueData();
      })
      .catch(() => { /* ignored */ }),
  ]));

  function setPresets(presetList: Array<Preset>) {
    presets = presetList;
    browser.storage.local.set({ presets: presetList });
  }
</script>

<style>
  .add {
    min-width: 250px;
    margin: 16px;
  }

  .add button {
    width: 100%;
    background-color: #7295c3;
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    display: inline-block;
  }
</style>
