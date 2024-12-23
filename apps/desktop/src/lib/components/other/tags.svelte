<script lang="ts">
  import SyncButton from "$components/button/syncButton.svelte";
  import StaticInput from "$components/input/staticInput.svelte";
  import CloseIcon from "$icons/closeIcon.svelte";

  let { tags = $bindable() }: { tags: string[] } = $props();
  let tmpTag = $state("");
  function addTag() {
    tags.push(tmpTag);
  }
  function removeTag(idx: number) {
    tags = tags.filter((_, i) => i != idx);
  }
</script>

<div class="tags">
  <StaticInput
    on:change={(e) => (tmpTag = e.detail.value)}
    label="New tag"
    --width="100%"
  />
  <SyncButton text="Add" type="passive" on:click={addTag} --width="100%" />
  <div class="list">
    {#each tags as tag, idx}
      <div class="tag">
        <span>{tag}</span>
        <button onclick={() => removeTag(idx)}>
          <CloseIcon />
        </button>
      </div>
    {/each}
  </div>
</div>

<style>
  .tags {
    width: var(--width, 100%);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .list {
    display: flex;
    gap: 0.5rem;
  }

  .tag {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    color: var(--backgroundColor);
    background-color: var(--foregroundColor);
    padding: 0.25rem;
    border-radius: var(--border-radius);
    --icon: var(--dangerColor);
  }
  .tags button {
    display: contents;
    cursor: pointer;
  }
</style>
