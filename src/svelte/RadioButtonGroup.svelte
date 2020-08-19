<div>
  <div>{title}</div>
  {#each items as item, i (item)}
    <label>
      <input type="radio" bind:group={checked} value={i}>
      {item}
    </label>
  {/each}
</div>

<script lang="ts">
  export let title: string;
  export let items: string[];

  export let checked: number = 0;
</script>

<style>
  label { white-space: nowrap }
</style>
