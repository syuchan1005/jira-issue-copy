<div class="field">
  <label>
    {name}
    <input
      type="text"
      readonly
      bind:value
      bind:this={previewField}
      on:click={(e) => e.stopPropagation()}
    >
  </label>
  <button on:click={clickCopy}>Copy</button>
</div>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // props
  export let value;
  export let name = 'Preview';

  // const
  const dispatch = createEventDispatcher();

  // data
  let previewField: HTMLInputElement;

  function clickCopy(event) {
    event.stopPropagation();
    if (!value) return;

    previewField.focus();
    previewField.select();

    document.execCommand('Copy');

    event.target.focus();

    dispatch('copied');
  }
</script>

<style>
  .field {
    width: 100%;
    display: flex;
    align-items: flex-end;
    user-select: none;
  }

  label, input {
    width: 100%;
  }

  input {
    min-width: 200px;
  }
</style>
