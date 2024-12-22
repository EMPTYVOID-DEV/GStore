<script>
  /**@type {string}*/
  export let text = "button";
  /**@type {import("svelte").Component|null} */
  export let icon = null;
  /**@type {"disabled"|"passive"|"primary"|"secondary"|"danger"} */
  export let type = "primary";
</script>

<button on:click class={type} disabled={type == "disabled"}>
  <svelte:component this={icon} />
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
    width: var(--width, fit-content);
    padding-inline: var(--padding-inline, 1rem);
    padding-block: var(--padding-block, 0.5rem);
    cursor: pointer;
    outline: none;
    border: none;
    background-color: var(--bg);
    border-radius: var(--border-radius);
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
</style>
