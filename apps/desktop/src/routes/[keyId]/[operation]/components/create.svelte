<script lang="ts">
  import { page } from "$app/state";
  import AsyncButton from "$components/button/asyncButton.svelte";
  import DefaultCheckList from "$components/checkList/defaultCheckList.svelte";
  import RecordView from "$components/other/recordView.svelte";
  import Tags from "$components/other/tags.svelte";
  import Upload from "$components/other/upload.svelte";
  import CreateIcon from "$icons/createIcon.svelte";
  import { createAuthHeader, showToast, tauriFetch } from "$shared/utils";
  import { fetch } from "@tauri-apps/plugin-http";

  let file = $state<File>(null);
  let isPublic = $state(false);
  let tags = $state<string[]>([]);
  let result = $state<Record<string, unknown>>(null);

  async function createFile() {
    if (!file) return showToast("Error", "A file must be uploaded", "danger");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("isPublic", isPublic ? "true" : "false");
    tags.forEach((el) => fd.append("tags", el));
    const url = `${page.data.hostUrl}/files/create`;
    const headers = createAuthHeader(page.data.key);
    const promise = fetch(url, { headers, body: fd, method: "POST" });
    const res = await tauriFetch(promise, "Creating a file");
    if (res._tag == "Left") return showToast("Error", res.left, "danger");
    await handleResult(res.right);
    showToast("Success", "File created successfully", "success");
  }

  async function handleResult(res: Response) {
    file = null;
    tags = [];
    isPublic = false;
    result = await res.json();
  }
</script>

<Upload bind:file />

<Tags bind:tags --width="100%" />

<DefaultCheckList
  checkList={[{ checked: isPublic, text: "Make the file public?" }]}
  on:change={(e) => (isPublic = e.detail.checked)}
/>

<AsyncButton
  text="Create File"
  action={createFile}
  icon={CreateIcon}
  --width="100%"
/>

{#if result}
  <RecordView record={result} />
{/if}
