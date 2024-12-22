<script>
  import { createEventDispatcher } from "svelte";
  import LoadingIcon from "../../icons/loadingIcon.svelte";

  /**@type {string}*/
  export let text = "button";

  /**@type {import("svelte").Component|null} */
  export let icon = null;

  /**@type {import("../../types").asyncButtonAction} This needs to be an async function that handles the button click*/
  export let action;

  /**@type {"disabled"|"passive"|"primary"|"secondary"|"danger"} */
  export let type = "primary";

  const dispatcher = createEventDispatcher();

  /**@type {"idle"|"loading"}*/
  let state = "idle";

  /**
   * @function handleClick This function will take care of state changes
   * @param {MouseEvent} event
   */
  async function handleClick(event) {
    if (state == "loading") return;
    state = "loading";
    try {
      const data = await action(event);
      dispatcher("resolve", { data });
    } catch (error) {
      dispatcher("rejected", { error });
    } finally {
      state = "idle";
    }
  }
</script>

<button
  disabled={type == "disabled"}
  class:loading={state == "loading"}
  class={type}
  on:click={handleClick}
>
  {#if state == "loading"}
    <LoadingIcon />
  {:else}
    <svelte:component this={icon} />
  {/if}
  <span>{text}</span>
</button>

<style>
  :is(.disabled, .primary, .secondary, .danger, .secondary, .passive) {
    --icon: var(--backgroundColor);
  }
  .disabled {
    --bg: var(--mutedColor);
    cursor: not-allowed;
  }
  .passive {
    --bg: var(--foregroundColor);
  }
  .primary {
    --bg: var(--primaryColor);
  }
  .secondary {
    --bg: var(--secondaryColor);
  }
  .danger {
    --bg: var(--dangerColor);
  }
  /**The padding will determine the width and height of the button*/
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    width: fit-content;
    padding-inline: var(--padding-inline, 1rem);
    padding-block: var(--padding-block, 0.5rem);
    cursor: pointer;
    outline: none;
    border: none;
    background-color: var(--bg);
    border-radius: var(--border-radius);
    transition: all 400ms linear;
  }
  button span {
    text-transform: capitalize;
    color: var(--backgroundColor);
    font-family: var(--bodyFont);
    font-size: var(--body);
    font-weight: 600;
  }
  button :global(svg) {
    width: 1.25rem;
    height: 1.25rem;
  }
  .loading {
    opacity: 0.8;
    cursor: not-allowed;
  }
</style>
