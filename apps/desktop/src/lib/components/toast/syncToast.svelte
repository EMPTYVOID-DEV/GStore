<script>
  import InfoIcon from "../../icons/infoIcon.svelte";
  import DangerIcon from "../../icons/dangerIcon.svelte";
  import SuccessIcon from "../../icons/successIcon.svelte";
  import CustomToast from "./customToast.svelte";
  /**@type {string}*/
  export let header;
  /**@type {string}*/
  export let description;
  /**@type {"primary"|"success"|"danger"}*/
  export let type = "primary";
  /**@type {import("../../types").toastAction|null}*/
  export let toastAction = null;
  /**@type {import("svelte").Component}*/
  $: icon =
    type == "primary" ? InfoIcon : type == "danger" ? DangerIcon : SuccessIcon;
</script>

<div class="syncToast {type}">
  <CustomToast {description} {header} {toastAction} {icon} on:closeToast />
</div>

<style>
  .primary {
    --icon: var(--primaryColor);
    --main-color: var(--primaryColor);
  }
  .success {
    --icon: var(--successColor);
    --main-color: var(--successColor);
  }
  .danger {
    --icon: var(--dangerColor);
    --main-color: var(--dangerColor);
  }
  .syncToast {
    /* this width css variable is passed by svelte-sonner */
    width: var(--width);
  }
</style>
