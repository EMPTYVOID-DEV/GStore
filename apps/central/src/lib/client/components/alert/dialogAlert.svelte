<script>
  import DefaultDialog from "../dialog/defaultDialog.svelte";
  import { scale } from "svelte/transition";
  import { quadInOut } from "svelte/easing";
  import SyncButton from "../button/syncButton.svelte";
  import { createEventDispatcher } from "svelte";
  /**@type {string}*/
  export let header;
  /**@type {string}*/
  export let description;
  /**@type {"primary"|"danger"}*/
  export let type = "primary";
  /**@type {{cancelLabel:string,confirmLabel:string}} */
  export let btnsLabels = {
    cancelLabel: "cancel",
    confirmLabel: "confirm",
  };
  const dispatcher = createEventDispatcher();
</script>

<DefaultDialog let:close>
  <svelte:fragment slot="trigger" let:open>
    <slot name="alertTrigger" {open} />
  </svelte:fragment>
  <div
    class="dialogAlert {type}"
    transition:scale={{
      duration: 520,
      easing: quadInOut,
      start: 0,
      opacity: 0.2,
    }}
  >
    <h4 class="header">{header}</h4>
    <span class="description">{description}</span>
    <div class="controls">
      <SyncButton
        text={btnsLabels.cancelLabel}
        type="passive"
        on:click={() => {
          dispatcher("cancel");
          close();
        }}
      />
      <SyncButton
        text={btnsLabels.confirmLabel}
        {type}
        on:click={() => {
          dispatcher("confirm");
          close();
        }}
      />
    </div>
  </div>
</DefaultDialog>

<style>
  .primary {
    --main-color: var(--primaryColor);
  }
  .danger {
    --main-color: var(--dangerColor);
  }

  .dialogAlert {
    width: 45vw;
    display: flex;
    flex-direction: column;
    background-color: var(--backgroundColor);
    border: 2px solid var(--main-color);
    border-radius: var(--border-radius);
    gap: 1rem;
    padding: 1.25rem;
  }
  .dialogAlert .header {
    display: inline-block;
    font-size: var(--h4);
    font-weight: 600;
    font-family: var(--headerFont);
    color: var(--foregroundColor);
  }
  .dialogAlert .description {
    font-size: var(--small);
    font-family: var(--bodyFont);
    color: var(--mutedColor);
  }
  .controls {
    display: flex;
    align-items: center;
    align-self: flex-end;
    gap: 0.5rem;
  }
  @media screen and (width<768px) {
    .dialogAlert {
      width: 95vw;
    }
  }
</style>
