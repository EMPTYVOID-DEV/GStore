<script lang="ts">
  import { page } from "$app/state";
  import type { Component } from "svelte";
  import Create from "./components/create.svelte";
  import Update from "./components/update.svelte";
  import Delete from "./components/delete.svelte";
  import { Toaster } from "svelte-sonner";
  import Path from "$components/other/path.svelte";
  import Read from "./components/read.svelte";
  import List from "./components/list.svelte";

  const operationsComponents: Map<string, Component> = new Map([
    ["create", Create],
    ["update", Update],
    ["delete", Delete],
    ["read", Read],
    ["list", List],
  ]);
  const TOAST_DURATION = 3500;
  const Operation = $derived(operationsComponents.get(page.params.operation))!;
</script>

<div class="main">
  <div class="top">
    <h1 class="header">{page.params.operation} Operation</h1>
    <Path />
  </div>

  <div class="center">
    <Operation />
  </div>
</div>

<Toaster expand duration={TOAST_DURATION} />

<style>
  .main {
    width: 100vw;
    min-height: 100vh;
    background-color: var(--backgroundColor);
    display: flex;
    flex-direction: column;
    gap: 5rem;
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
    text-transform: capitalize;
  }

  .center {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-self: center;
    width: 50%;
  }
</style>
