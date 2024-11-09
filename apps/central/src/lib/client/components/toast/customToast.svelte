<script>
  import { createEventDispatcher } from "svelte";
  import CloseIcon from "../../icons/closeIcon.svelte";

  /**@type {string}*/
  export let header;
  /**@type {string}*/
  export let description;
  /**@type {import("../../types").toastAction|null}*/
  export let toastAction;
  /**@type {import("../../types").iconComponent}*/
  export let icon;
  const dispatcher = createEventDispatcher();

  function fireCloseEvent() {
    dispatcher("closeToast");
  }
</script>

<div class="customToast">
  <svelte:component this={icon} />
  <div class="toastContent">
    <span class="header">{header}</span>
    <span class="description">{description}</span>
  </div>
  {#if toastAction}
    <button class="toastBtn" on:click={toastAction.action}>
      {toastAction.label}
    </button>
  {/if}
  <button class="close" on:click={fireCloseEvent}>
    <CloseIcon />
  </button>
</div>

<style>
  .customToast {
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 0.5rem;
    border: 2px solid var(--main-color);
    border-radius: var(--border-radius);
    background-color: color-mix(
      in srgb,
      var(--main-color) 30%,
      transparent 70%
    );
  }
  .toastContent {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .toastContent .header {
    font-size: var(--body);
    font-family: var(--bodyFont);
    font-weight: 600;
    color: var(--foregroundColor);
  }
  .toastContent .description {
    font-size: var(--body);
    font-family: var(--bodyFont);
    color: var(--foregroundColor);
  }
  .toastBtn {
    width: fit-content;
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
    cursor: pointer;
    outline: none;
    border: none;
    background-color: var(--main-color);
    border-radius: var(--border-radius);
    color: var(--foregroundColor);
    font-family: var(--bodyFont);
    font-size: var(--body);
    font-weight: 600;
    align-self: center;
  }

  .close {
    background-color: var(--main-color);
    border: none;
    outline: none;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -10%;
    right: -2%;
    cursor: pointer;
    border-radius: 50%;
    --icon: var(--foregroundColor);
  }
</style>
