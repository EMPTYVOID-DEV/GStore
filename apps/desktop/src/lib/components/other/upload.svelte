<script lang="ts">
  import SyncButton from "$components/button/syncButton.svelte";
  import UploadIcon from "$icons/uploadIcon.svelte";
  import { path } from "@tauri-apps/api";
  import { open } from "@tauri-apps/plugin-dialog";
  import { readFile } from "@tauri-apps/plugin-fs";

  let { file = $bindable() }: { file: File } = $props();

  async function upload() {
    const selected = await open({ multiple: false, directory: false });
    if (!selected) return;
    const content = await readFile(selected);
    const filname = await path.basename(selected);
    file = new File([content], filname);
  }
</script>

<div class="upload">
  <SyncButton text="Upload a File" icon={UploadIcon} on:click={upload} />
  {#if file}
    <span class="file-name">{file.name}</span>
  {:else}
    <span class="placeholder">No file selected</span>
  {/if}
</div>

<style>
  .upload {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .upload span {
    color: var(--foregroundColor);
  }
</style>
