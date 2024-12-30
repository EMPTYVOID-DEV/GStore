<script>
  import CloseIcon from "../../icons/closeIcon.svelte";
  import { createEventDispatcher } from "svelte";
  /**@type {string}*/
  export let name = "";
  /**@type {string}*/
  export let value = "";
  /**@type {string}*/
  export let label = "";
  /**@type {"text"|"password"|"email"|"number"}*/
  export let inputType = "text";
  /**@type {boolean}*/
  export let disabled = false;
  /**@type {import("../../types").checkFunction} This function will be used to validate the input on every change*/
  export let checkFunction;
  const dispatcher = createEventDispatcher();
  /**@type {import("../../types").reactiveInputStatus}*/
  $: status = checkFunction(value);
</script>

<div class="input-container {status.state}" class:disabled>
  <label for="input">{label}</label>
  <input
    {name}
    {disabled}
    {value}
    type={inputType}
    on:input={(e) => {
      status = checkFunction(e.currentTarget.value);
      dispatcher("change", { value: e.currentTarget.value });
    }}
  />
  {#if status.state == "invalid"}
    <div class="error">
      <CloseIcon />
      <span>{status.errorMsg}</span>
    </div>
  {/if}
</div>

<style>
  .idle {
    --main-color: var(--primaryColor);
  }
  .valid {
    --main-color: var(--successColor);
  }

  .invalid {
    --icon: var(--dangerColor);
    --main-color: var(--dangerColor);
  }

  .input-container {
    width: var(--width, 100%);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .input-container label {
    font-family: var(--headerFont);
    font-size: var(--body);
    color: var(--foregroundColor);
    text-transform: capitalize;
  }
  .input-container label:empty {
    display: none;
  }

  .input-container input {
    width: 100%;
    padding-left: 0.5rem;
    padding-block: 0.5rem;
    font-size: var(--body);
    font-family: var(--bodyFont);
    color: var(--foregroundColor);
    background-color: transparent;
    border-radius: var(--border-radius);
    border: 2px solid var(--foregroundColor);
    outline: none;
  }
  .input-container input:focus {
    border-color: var(--main-color);
    background-color: color-mix(
      in srgb,
      var(--main-color) 30%,
      transparent 70%
    );
  }
  .input-container input[type="number"]::-webkit-outer-spin-button,
  .input-container input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .error {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.25rem;
  }
  .error span {
    font-size: var(--small);
    font-family: var(--bodyFont);
    color: var(--main-color);
    text-transform: capitalize;
  }
  .disabled input {
    border-color: var(--mutedColor);
    color: var(--mutedColor);
  }
  .disabled label {
    color: var(--mutedColor);
  }
  .disabled .error {
    display: none;
  }
</style>
