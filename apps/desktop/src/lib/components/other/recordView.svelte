<script lang="ts">
  let { record }: { record: Record<string, unknown> } = $props();
</script>

<div class="result">
  {#each Object.entries(record) as entry}
    <div class="entry">
      <span class="key">"{entry[0]}"</span>
      <span>:</span>
      <span>{JSON.stringify(entry[1])}</span>
      {#if entry[0] !== Object.keys(record).slice(-1)[0]}
        <span>,</span>
      {/if}
    </div>
  {/each}
</div>

<style>
  .result {
    width: 100%;
    --bg-opacity: 8%;
    background-color: color-mix(
      in srgb,
      var(--primaryColor) var(--bg-opacity),
      transparent
    );
    padding: 1rem;
    border-radius: var(--border-radius);
  }
  .entry {
    display: flex;
    gap: 0.25rem;
  }
  .entry span {
    color: var(--foregroundColor);
  }
  .key {
    font-weight: bold;
  }
</style>
