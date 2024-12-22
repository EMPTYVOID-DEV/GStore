<script>
  import DangerIcon from "../../icons/dangerIcon.svelte";
  import LoadingIcon from "../../icons/loadingIcon.svelte";
  import SuccessIcon from "../../icons/successIcon.svelte";
  import CustomToast from "./customToast.svelte";
  /**@type {import("../../types").toastState}*/
  export let loadingState;
  /**@typedef {import("../../types").toastState} state*/
  /**@type {Promise<state>}*/
  export let promise;
</script>

{#await promise}
  <div class="loadingToast">
    <CustomToast
      on:closeToast
      icon={LoadingIcon}
      description={loadingState.description}
      header={loadingState.header}
      toastAction={loadingState.toastAction}
    />
  </div>
{:then successState}
  <div class="successToast">
    <CustomToast
      on:closeToast
      icon={SuccessIcon}
      description={successState.description}
      header={successState.header}
      toastAction={successState.toastAction}
    />
  </div>
{:catch dangerToast}
  <div class="dangerToast">
    <CustomToast
      on:closeToast
      icon={DangerIcon}
      description={dangerToast.description}
      header={dangerToast.header}
      toastAction={dangerToast.toastAction}
    />
  </div>
{/await}

<style>
  .dangerToast,
  .successToast,
  .loadingToast {
    /* this width css variable is passed by svelte-sonner */
    width: var(--width);
  }
  .loadingToast {
    --icon: var(--mutedColor);
    --main-color: var(--mutedColor);
  }
  .successToast {
    --icon: var(--successColor);
    --main-color: var(--successColor);
  }
  .dangerToast {
    --icon: var(--dangerColor);
    --main-color: var(--dangerColor);
  }
</style>
