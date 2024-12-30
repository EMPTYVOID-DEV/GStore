<script lang="ts">
  import { page } from "$app/state";
  import AsyncButton from "$components/button/asyncButton.svelte";
  import StaticInput from "$components/input/staticInput.svelte";
  import Option from "$components/other/option.svelte";
  import RecordView from "$components/other/recordView.svelte";
  import Tags from "$components/other/tags.svelte";
  import Upload from "$components/other/upload.svelte";
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
    showToast("Success", "File updated successfully", "success");
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

<Option bind:include={name.include} header="Update the name ?">
  {#snippet hidden()}
    <StaticInput
      label="Name"
      value={name.value}
      on:change={(e) => (name.value = e.detail.value)}
    />
  {/snippet}
</Option>

<Option bind:include={tags.include} header="Update tags ?">
  {#snippet hidden()}
    <Tags bind:tags={tags.value} />
  {/snippet}
</Option>

<Option bind:include={file.include} header="Update the content ?">
  {#snippet hidden()}
    <Upload bind:file={file.value} />
  {/snippet}
</Option>

<AsyncButton
  text="Update a file"
  action={updateFile}
  --width="100%"
  icon={UpdateIcon}
/>

{#if result}
  <RecordView record={result} />
{/if}
