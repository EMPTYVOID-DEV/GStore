<script lang="ts">
  import { page } from "$app/state";
  import AsyncButton from "$components/button/asyncButton.svelte";
  import StaticInput from "$components/input/staticInput.svelte";
  import RecordView from "$components/other/recordView.svelte";
  import DeleteIcon from "$icons/deleteIcon.svelte";
  import { createAuthHeader, showToast, tauriFetch } from "$shared/utils";
  let id = $state("");
  let result = $state<Record<string, unknown>>(null);

  async function deleteFile() {
    const url = `${page.data.hostUrl}/files/delete/${id}`;
    const headers = createAuthHeader(page.data.key);
    const promise = fetch(url, { headers, method: "DELETE" });
    const res = await tauriFetch(promise, "Deleting a file");
    if (res._tag == "Left") return showToast("Error", res.left, "danger");
    await handleResult(res.right);
  }

  async function handleResult(res: Response) {
    id = "";
    result = await res.json();
  }
</script>

<StaticInput
  value={id}
  label="File Id"
  on:change={(e) => (id = e.detail.value)}
/>

<AsyncButton
  text="Delete a file"
  action={deleteFile}
  --width="100%"
  icon={DeleteIcon}
/>

{#if result}
  <RecordView record={result} />
{/if}
