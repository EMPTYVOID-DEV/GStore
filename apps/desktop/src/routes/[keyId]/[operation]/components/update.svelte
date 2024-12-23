<script lang="ts">
  import { page } from "$app/state";
  import AsyncButton from "$components/button/asyncButton.svelte";
  import StaticInput from "$components/input/staticInput.svelte";
  import RecordView from "$components/other/recordView.svelte";
  import Tags from "$components/other/tags.svelte";
  import Upload from "$components/other/upload.svelte";
  import DownIcon from "$icons/downIcon.svelte";
  import RightIcon from "$icons/rightIcon.svelte";
  import UpdateIcon from "$icons/updateIcon.svelte";
  import { createAuthHeader, showToast, tauriFetch } from "$shared/utils";

  let id = $state("");

  let name = $state<{ include: boolean; value: string }>({
    include: false,
    value: "",
  });
  let file = $state<{ include: boolean; value: File }>({
    include: false,
    value: null,
  });
  let tags = $state<{ include: boolean; value: string[] }>({
    include: false,
    value: [],
  });
  let result = $state<Record<string, unknown>>(null);

  async function updateFile() {
    if (!name.include && !tags.include && !file.include)
      return showToast(
        "Error",
        "Need at least update one of the options",
        "danger"
      );
    const fd = new FormData();
    if (name.include) fd.append("name", name.value);
    if (file.include && file.value) fd.append("file", file.value);
    if (tags.include) tags.value.forEach((el) => fd.append("tags", el));
    const url = `${page.data.hostUrl}/files/update/${id}`;
    const headers = createAuthHeader(page.data.key);
    const promise = fetch(url, { headers, body: fd, method: "PUT" });
    const res = await tauriFetch(promise, "Updating a file");
    if (res._tag == "Left") return showToast("Error", res.left, "danger");
    await handleResult(res.right);
  }
  async function handleResult(res: Response) {
    id = "";
    name.value = "";
    tags.value = [];
    file.value = null;
    result = await res.json();
  }
</script>

<StaticInput
  label="File Id"
  value={id}
  on:change={(e) => (id = e.detail.value)}
/>

<div class="option">
  <div class="head">
    <button onclick={() => (name.include = !name.include)}>
      {#if name.include}
        <DownIcon />
      {:else}
        <RightIcon />
      {/if}
    </button>
    <h3>Update name ?</h3>
  </div>
  {#if name.include}
    <StaticInput
      label="New name"
      value={name.value}
      on:change={(e) => (name.value = e.detail.value)}
    />
  {/if}
</div>

<div class="option">
  <div class="head">
    <button onclick={() => (tags.include = !tags.include)}>
      {#if tags.include}
        <DownIcon />
      {:else}
        <RightIcon />
      {/if}
    </button>
    <h3>Update tags ?</h3>
  </div>
  {#if tags.include}
    <Tags bind:tags={tags.value} />
  {/if}
</div>

<div class="option">
  <div class="head">
    <button onclick={() => (file.include = !file.include)}>
      {#if file.include}
        <DownIcon />
      {:else}
        <RightIcon />
      {/if}
    </button>
    <h3>Update file content ?</h3>
  </div>
  {#if file.include}
    <Upload bind:file={file.value} />
  {/if}
</div>

<AsyncButton
  text="Update a file"
  action={updateFile}
  --width="100%"
  icon={UpdateIcon}
/>

{#if result}
  <RecordView record={result} />
{/if}

<style>
  .option {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .head h3 {
    color: var(--foregroundColor);
  }
  .head button {
    cursor: pointer;
    display: contents;
  }
</style>
