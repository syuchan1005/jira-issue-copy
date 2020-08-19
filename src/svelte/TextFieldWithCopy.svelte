<div>
  <label>
    Preview
    <input type="text" readonly bind:value bind:this={previewField}>
  </label>
  <button on:click={clickCopy}>Copy</button>
</div>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // props
  export let value;

  // const
  const dispatch = createEventDispatcher();

  // data
  let previewField: HTMLInputElement;

  function clickCopy() {
    if (!value) return;

    previewField.focus();
    previewField.select();

    document.execCommand('Copy');

    dispatch('copied');
  }
</script>
