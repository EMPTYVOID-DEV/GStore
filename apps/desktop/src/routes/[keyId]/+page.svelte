<script lang="ts">
  import { goto } from "$app/navigation";
  import SyncButton from "$components/button/syncButton.svelte";
  import Path from "$components/other/path.svelte";
  import CreateIcon from "$icons/createIcon.svelte";
  import DeleteIcon from "$icons/deleteIcon.svelte";
  import UpdateIcon from "$icons/updateIcon.svelte";
  import type { Permissions } from "$shared/types.js";
  import type { Component } from "svelte";

  let { data } = $props();
  // Some operations need more than one permission
  const operationsMap: Map<
    string,
    { icon: Component; requiredPermissions: Permissions[] }
  > = new Map([
    ["create", { icon: CreateIcon, requiredPermissions: ["create"] }],
    ["update", { icon: UpdateIcon, requiredPermissions: ["update"] }],
    ["delete", { icon: DeleteIcon, requiredPermissions: ["delete"] }],
  ]);
</script>

<div class="operations">
  <div class="top">
    <h1 class="header">Allowed Operations</h1>
    <Path />
  </div>
  <div class="allowed">
    {#each operationsMap.keys() as operation}
      {@const requiredSet = new Set(
        operationsMap.get(operation)?.requiredPermissions
      )}
      {#if new Set(data.permissions).isSupersetOf(requiredSet)}
        <SyncButton
          --width="100%"
          text={operation}
          icon={operationsMap.get(operation)?.icon}
          on:click={() => goto(`/${data.id}/${operation}`)}
        />
      {/if}
    {/each}
  </div>
</div>

<style>
  .operations {
    width: 100vw;
    min-height: 100vh;
    background-color: var(--backgroundColor);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-inline: 2%;
    padding-block: 3%;
  }

  .top {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .header {
    color: var(--foregroundColor);
  }

  .allowed {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
</style>
