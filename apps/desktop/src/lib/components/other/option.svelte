<script lang="ts">
  import DownIcon from "$icons/downIcon.svelte";
  import RightIcon from "$icons/rightIcon.svelte";
  import type { Snippet } from "svelte";

  let {
    header,
    include = $bindable(),
    hidden,
  }: { include: boolean; header: string; hidden: Snippet } = $props();
</script>

<div class="option">
  <div class="head">
    <button onclick={() => (include = !include)}>
      {#if include}
        <DownIcon />
      {:else}
        <RightIcon />
      {/if}
    </button>
    <span>{header}</span>
  </div>
  {#if include}
    {@render hidden()}
  {/if}
</div>

<style>
  .option {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .head span {
    color: var(--foregroundColor);
  }
  .head button {
    cursor: pointer;
    display: contents;
  }
</style>
