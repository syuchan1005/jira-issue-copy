<template>
  <div class="button-group">
    <button class="button" on:click={() => dispatch('click:up')}>Up</button>
    <button class="button" on:click={() => dispatch('click:down')}>Down</button>
    <button class="button" on:click={() => dispatch('click:remove')}>Remove</button>
  </div>
</template>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let dispatch = createEventDispatcher();
</script>

<style lang="scss">
  $radius: 4px;

  .button-group {
    display: flex;
    justify-content: flex-end;

    .button {
      border: lightgray solid 1px;
      background: transparent;
      padding: 4px 8px;
      text-align: center;
      text-decoration: none;
      display: inline-block;

      &:nth-child(1) {
        border-top-left-radius: $radius;
        border-bottom-left-radius: $radius;
      }

      &:nth-child(n+2) {
        border-left: none;
      }

      &:last-child {
        border-top-right-radius: $radius;
        border-bottom-right-radius: $radius;
      }
    }
  }
</style>
