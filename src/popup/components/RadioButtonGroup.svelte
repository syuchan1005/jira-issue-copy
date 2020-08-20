<div>
  <div>{title}</div>
  {#each items as item (item.value)}
    <label>
      <input type="radio" bind:group={checked} value={item.value}>
      {item.name}
    </label>
  {/each}
</div>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  //const
  const dispatch = createEventDispatcher();

  // props
  export let title: string;
  export let items: Array<{
    name: string,
    value: string,
  }>;

  export let checked: string = 0;

  $: dispatch('change', checked);
</script>

<style>
  label { white-space: nowrap }
</style>
