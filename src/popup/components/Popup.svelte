<main>
  {#each presets as preset, i (preset.id)}
    <PresetRow
      bind:issueData
      bind:preset={preset}
      on:change:preset={(e) => {
        const p = [...presets];
        p[i] = e.detail;
        browser.contextMenus.update(p[i].id, {
          title: p[i].name,
        }).catch(() => addPresetContextMenu(p[i]));
        setPresets(p);
      }}
      on:click:remove={async () => {
        const p = [...presets];
        p.splice(i, 1);
        browser.contextMenus.remove(presets[i].id)
          .catch(() => { /* ignored */});
        setPresets(p);
      }}
      on:click:up={() => {
        if (i === 0) return;
        const p = [...presets];
        const a = p[i - 1];
        p[i - 1] = p[i];
        p[i] = a;
        setPresets(p);
        resetContextMenus();
      }}
      on:click:down={() => {
        if (i >= presets.length - 1) return;
        const p = [...presets];
        const a = p[i + 1];
        p[i + 1] = p[i];
        p[i] = a;
        setPresets(p);
        resetContextMenus();
      }}
    />
    <Divider/>
  {/each}

  <div class="add">
    <button on:click={clickAdd}>Add</button>
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
    parentContextMenuId,
    resetContextMenus,
  } from '../../constant';

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
      .catch(() => { /* ignored */
      }),
  ]));

  function clickAdd() {
    const preset = defaultPreset();
    preset.name = `${preset.name} ${presets.length + 1}`;
    addPresetContextMenu(preset);
    setPresets([...presets, preset]);
  }

  function setPresets(presetList: Array<Preset>) {
    presets = presetList;
    browser.storage.local.set({ presets: presetList });
  }

  function addPresetContextMenu(preset: Preset) {
    return browser.contextMenus.create({
      title: preset.name,
      parentId: parentContextMenuId,
      id: preset.id,
      type: 'normal',
      contexts: ['all'],
    });
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
