<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import RightIcon from "$icons/rightIcon.svelte";

  let pathname = $derived(page.url.pathname.split("/"));

  function gotoPath(idx: number) {
    const target = pathname.slice(0, idx + 1).join("/");
    console.log(target);
    goto(target);
  }
</script>

<div class="path">
  <span onclick={() => goto("/")}>home</span>
  {#each pathname as item, idx}
    <span onclick={() => gotoPath(idx)}>{item}</span>
    {#if pathname.length - 1 != idx}
      <RightIcon />
    {/if}
  {/each}
</div>

<style>
  .path {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .path span {
    color: var(--foregroundColor);
    cursor: pointer;
  }

  .path span:hover {
    color: var(--primaryColor);
  }
</style>
