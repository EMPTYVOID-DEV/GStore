<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import SyncButton from "$components/button/syncButton.svelte";
  import ReactiveInput from "$components/input/reactiveInput.svelte";
  import FormWrapper from "$components/other/formWrapper.svelte";
  import { showToast } from "$shared/utils";
  import { getValidator, urlSchema } from "$shared/zod";
  import { Store } from "@tauri-apps/plugin-store";

  interface Props {
    settingsStore: Store;
    hostUrl: string;
  }

  const urlValidator = getValidator(urlSchema);

  let { hostUrl, settingsStore }: Props = $props();

  async function handleSaveUrl() {
    const isValid = urlValidator(hostUrl);
    if (isValid.state == "invalid")
      showToast("Error", isValid.errorMsg, "danger");
    else await settingsStore.set("hostUrl", hostUrl);
    await invalidateAll();
  }
</script>

<FormWrapper>
  <section class="input">
    <h3>Api Host</h3>
    <span>This specifies the host of the store api</span>
    <ReactiveInput
      checkFunction={urlValidator}
      inputType="text"
      value={hostUrl}
      on:change={(e) => (hostUrl = e.detail.value)}
    />
  </section>
  <svelte:fragment slot="submitter">
    <SyncButton text="Save" type="passive" on:click={handleSaveUrl} />
  </svelte:fragment>
</FormWrapper>

<style>
  .input {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.75rem;
    --width: 50%;
  }

  .input :is(h3, span) {
    color: var(--foregroundColor);
  }

  @media screen and (max-width: 768px) {
    .input {
      --width: 80%;
    }
  }
</style>
