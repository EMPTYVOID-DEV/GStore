<script lang="ts">
  import DefaultTabs from "$components/tabs/defaultTabs.svelte";
  import SettingsIcon from "$icons/settingsIcon.svelte";
  import StoreIcon from "$icons/storeIcon.svelte";
  import { onMount, type Component } from "svelte";
  import { Toaster } from "svelte-sonner";
  import SettingsTab from "./components/settingsTab.svelte";
  import AddKey from "./components/addKey.svelte";
  import KeyContainer from "./components/keyContainer.svelte";
  import type { ApiKey } from "$shared/types";
  import { tauriFetch } from "$shared/utils";
  import { invalidateAll } from "$app/navigation";

  let { data } = $props();
  let activeTab = $state(0);

  const TOAST_DURATION = 3500;
  const tabs: { title: string; icon?: Component }[] = [
    { title: "Stores", icon: StoreIcon },
    { title: "Settings", icon: SettingsIcon },
  ];

  onMount(async () => {
    const validKeys: ApiKey[] = [];
    for (const storedKey of data.apiKeys) {
      const url = `${data.hostUrl}/info/key-info/${storedKey.key}`;
      const res = await tauriFetch(fetch(url), "Adding a new key");
      if (res._tag == "Left") continue;
      const apiKey = (await res.right.json()) as ApiKey;
      if (new Date() >= new Date(apiKey.expiresAt)) continue;
      validKeys.push(apiKey);
    }
    data.keysStore.set("keys", validKeys);
    await invalidateAll();
  });
</script>

<div class="home">
  <h1 class="header">Home</h1>
  <DefaultTabs {tabs} bind:activeTab />
  {#if activeTab == 0}
    <AddKey
      apiKeys={data.apiKeys}
      hostUrl={data.hostUrl}
      keysStore={data.keysStore}
    />
    <KeyContainer apiKeys={data.apiKeys} keysStore={data.keysStore} />
  {:else}
    <SettingsTab hostUrl={data.hostUrl} settingsStore={data.settingsStore} />
  {/if}
</div>

<Toaster expand duration={TOAST_DURATION} />

<style>
  .home {
    width: 100vw;
    min-height: 100vh;
    background-color: var(--backgroundColor);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2%;
  }

  .header {
    color: var(--foregroundColor);
  }
</style>
