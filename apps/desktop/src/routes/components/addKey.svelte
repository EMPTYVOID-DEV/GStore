<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import SyncButton from "$components/button/syncButton.svelte";
  import StaticInput from "$components/input/staticInput.svelte";
  import PlusIcon from "$icons/plusIcon.svelte";
  import type { ApiKey } from "$shared/types";
  import { showToast, tauriFetch } from "$shared/utils";
  import type { Store } from "@tauri-apps/plugin-store";
  import { fetch } from "@tauri-apps/plugin-http";
  import { show } from "fp-ts";

  interface Props {
    keysStore: Store;
    apiKeys: ApiKey[];
    hostUrl: string;
  }

  let { apiKeys, hostUrl, keysStore }: Props = $props();
  let tmpKey = $state("");

  async function handleStoreAdd() {
    if (apiKeys.find((el) => el.key == tmpKey))
      return showToast("Info", "Key exists already", "primary");
    const url = `${hostUrl}/info/key-info/${tmpKey}`;
    const res = await tauriFetch(fetch(url), "Adding a new key");
    if (res._tag == "Left") return showToast("Error", res.left, "danger");
    const apiKey = (await res.right.json()) as ApiKey;
    if (new Date() >= new Date(apiKey.expiresAt))
      return showToast("Error", "Key has expired", "danger");
    await keysStore.set("keys", [...apiKeys, apiKey]);
    await invalidateAll();
    showToast("Success", "Key added successfully", "success");
  }
</script>

<StaticInput
  on:change={(e) => (tmpKey = e.detail.value)}
  inputType="text"
  label="Api key value"
/>

<SyncButton
  text="Add a new key"
  icon={PlusIcon}
  on:click={handleStoreAdd}
  --width="100%"
/>
