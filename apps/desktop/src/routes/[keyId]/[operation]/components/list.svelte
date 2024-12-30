<script lang="ts">
  import StaticInput from "$components/input/staticInput.svelte";
  import DefaultSelect from "$components/select/defaultSelect.svelte";
  import Option from "$components/other/option.svelte";
  import Tags from "$components/other/tags.svelte";
  import { page } from "$app/state";
  import { createAuthHeader, tauriFetch, showToast } from "$shared/utils";
  import AsyncButton from "$components/button/asyncButton.svelte";
  import RecordView from "$components/other/recordView.svelte";
  import ListIcon from "$icons/listIcon.svelte";
  import { getValidator, pageIndexSchema, pageSizeSchema } from "$shared/zod";
  import ReactiveInput from "$components/input/reactiveInput.svelte";

  let pageSize = $state("10");
  let pageIndex = $state("0");
  let name = $state<{ include: boolean; value: string }>({
    include: false,
    value: "",
  });
  let ext = $state<{ include: boolean; value: string }>({
    include: false,
    value: "",
  });
  let tags = $state<{ include: boolean; value: string[] }>({
    include: false,
    value: [],
  });
  let order = $state<{ value: string; label: string }[]>([
    { value: "size-asc", label: "Size Ascending" },
  ]);
  let results = $state<Record<string, unknown>[]>(null);

  const pageSizeValidator = getValidator(pageSizeSchema);

  const pageIndexValidator = getValidator(pageIndexSchema);

  const orderOptions = [
    {
      label: "Size Ascending",
      value: "size-asc",
    },
    {
      label: "Name Ascending",
      value: "name-asc",
    },
    {
      label: "Date Ascending",
      value: "date-asc",
    },
    {
      label: "Size Descending",
      value: "size-desc",
    },
    {
      label: "Name Descending",
      value: "name-desc",
    },
    {
      label: "Date Descending",
      value: "date-desc",
    },
  ];

  async function listFiles() {
    if (
      pageIndexValidator(pageIndex).state == "invalid" ||
      pageSizeValidator(pageSize).state == "invalid"
    )
      return showToast("Error", "Invalid page size and index", "danger");
    const url = `${page.data.hostUrl}/files/list`;
    const queryParmas = new URLSearchParams();
    queryParmas.append("size", pageSize);
    queryParmas.append("page", pageIndex);
    queryParmas.append("orderBy", order.at(0).value);
    if (name.include) queryParmas.append("name", name.value);
    if (ext.include) queryParmas.append("extension", `.${ext.value}`);
    if (tags.include)
      tags.value.forEach((el) => queryParmas.append("tags", el));
    const headers = createAuthHeader(page.data.key);
    const promise = fetch(`${url}?${queryParmas.toString()}`, { headers });
    const res = await tauriFetch(promise, "Listing files");
    if (res._tag == "Left") return showToast("Error", res.left, "danger");
    await handleResult(res.right);
    showToast("Success", "Files listed successfully", "success");
  }
  async function handleResult(res: Response) {
    name.value = "";
    ext.value = "";
    tags.value = [];
    results = await res.json();
  }
</script>

<ReactiveInput
  checkFunction={pageSizeValidator}
  label="The page size"
  value={pageSize}
  on:change={(e) => (pageSize = e.detail.value)}
/>

<ReactiveInput
  checkFunction={pageIndexValidator}
  label="The page index"
  value={pageIndex}
  on:change={(e) => (pageIndex = e.detail.value)}
/>

<DefaultSelect
  elements={orderOptions}
  label="The ordering criteria"
  value={order}
  on:change={(e) => (order = e.detail.selected)}
/>

<Option bind:include={name.include} header="Filter by name">
  {#snippet hidden()}
    <StaticInput
      label="Name"
      value={name.value}
      on:change={(e) => (name.value = e.detail.value)}
    />
  {/snippet}
</Option>

<Option bind:include={ext.include} header="Filter by extension">
  {#snippet hidden()}
    <StaticInput
      label="Extension"
      value={ext.value}
      on:change={(e) => (ext.value = e.detail.value)}
    />
  {/snippet}
</Option>

<Option bind:include={tags.include} header="Filter by tags">
  {#snippet hidden()}
    <Tags bind:tags={tags.value} />
  {/snippet}
</Option>

<AsyncButton
  text="List files"
  action={listFiles}
  icon={ListIcon}
  --width="100%"
/>

{#if results}
  {#each results as result}
    <RecordView record={result} />
  {/each}
{/if}
