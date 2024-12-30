<script lang="ts">
  import type { ApiKey } from "$shared/types";
  import DeleteIcon from "$icons/deleteIcon.svelte";
  import type { Store } from "@tauri-apps/plugin-store";
  import { goto, invalidateAll } from "$app/navigation";
  import RightIcon from "$icons/rightIcon.svelte";
  import { showToast } from "$shared/utils";

  let { apiKeys, keysStore }: { apiKeys: ApiKey[]; keysStore: Store } =
    $props();

  async function deleteKey(key: string) {
    const newKeys = apiKeys.filter((apiKey) => apiKey.key != key);
    await keysStore.set("keys", newKeys);
    await invalidateAll();
    showToast("Success", "Key deleted successfully", "success");
  }
</script>

<div class="keys-container">
  {#each apiKeys as key}
    <div class="key-card">
      <div class="key-header">
        <div class="key-info">
          <span>Store Id: {key.storeId}</span>
          <span>Key Id: {key.id}</span>
          <span>Key Name: {key.name}</span>
          <span>Expires: {key.expiresAt}</span>
        </div>

        <div class="key-actions">
          <button
            class="goto"
            aria-label="Goto Key"
            onclick={() => goto(`/${key.id}`)}
          >
            <RightIcon />
          </button>

          <button
            class="delete"
            aria-label="Delete Key"
            onclick={() => deleteKey(key.key)}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>

      <div class="key-permissions">
        <h4>Permissions:</h4>
        <span>{key.permissions.join(", ")}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  :is(span, h4) {
    color: var(--foregroundColor);
  }

  .keys-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .key-card {
    background: color-mix(in srgb, var(--primaryColor) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--primaryColor) 30%, transparent);
    border-radius: var(--border-radius);
  }

  .key-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  .key-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .key-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .key-actions button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--border-radius);
    transition: background-color 0.2s ease;
  }

  .key-actions button :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
    fill: var(--foregroundColor);
  }

  .goto:hover {
    background-color: color-mix(in srgb, var(--primaryColor) 20%, transparent);
  }

  .delete:hover {
    background-color: color-mix(in srgb, var(--dangerColor) 20%, transparent);
  }

  .key-permissions {
    padding: 1rem;
    border-top: 1px solid
      color-mix(in srgb, var(--primaryColor) 30%, transparent);
    background: color-mix(in srgb, var(--primaryColor) 5%, transparent);
  }
</style>
