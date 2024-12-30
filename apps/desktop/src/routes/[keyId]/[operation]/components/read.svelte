<script lang="ts">
  import { page } from "$app/state";
  import AsyncButton from "$components/button/asyncButton.svelte";
  import SyncButton from "$components/button/syncButton.svelte";
  import StaticInput from "$components/input/staticInput.svelte";
  import ReadIcon from "$icons/readIcon.svelte";
  import {
    createAuthHeader,
    tauriFetch,
    showToast,
    writeStreamToFile,
  } from "$shared/utils";
  import { path } from "@tauri-apps/api";
  import { open as openDialog } from "@tauri-apps/plugin-dialog";
  import Mime from "mime";

  let id = $state("");
  let downloadPath = $state("Not selected");

  async function showDialog() {
    const selected = await openDialog({ multiple: false, directory: true });
    if (!selected) return;
    downloadPath = selected;
  }

  async function readFile() {
    if (downloadPath == "Not selected")
      return showToast("Error", "Download path not selected", "danger");
    const url = `${page.data.hostUrl}/files/read/${id}`;
    const headers = createAuthHeader(page.data.key);
    const promise = fetch(url, { headers });
    const res = await tauriFetch(promise, "Reading a file");
    if (res._tag == "Left") return showToast("Error", res.left, "danger");
    try {
      await handleResult(res.right);
      showToast("Success", "File read successfully", "success");
    } catch (error) {
      showToast("Error", "Unable to save the file", "danger");
    }
  }
  async function handleResult(res: Response) {
    const type = res.headers.get("content-type");
    const extension = Mime.getExtension(type);
    const readStream = await res.blob().then((blob) => blob.stream());
    const filePath = await path.join(downloadPath, `${id}.${extension}`);
    await writeStreamToFile(filePath, readStream);
    id = "";
    downloadPath = "Not selected";
  }
</script>

<StaticInput
  value={id}
  label="File Id"
  on:change={(e) => (id = e.detail.value)}
/>

<div class="download-path">
  <SyncButton text="Download path" on:click={showDialog} --width="100%" />
  <span>{downloadPath}</span>
</div>

<AsyncButton text="Load" action={readFile} --width="100%" icon={ReadIcon} />

<style>
  .download-path {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .download-path span {
    color: var(--foregroundColor);
  }
</style>
