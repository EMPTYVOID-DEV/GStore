<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$client/components/ui/button/button.svelte';
  import Input from '$client/components/ui/input/input.svelte';
  import Label from '$client/components/ui/label/label.svelte';
    import { InfinityIcon } from 'lucide-svelte';

  export let form;
  let formLoading: boolean = false;
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(107,120,162,.2)_100%)]"></div>
  <form method="POST" 
        action="?/access_store" 
        class="space-y-6 max-w-lg p-6 bg-white shadow-md rounded-lg"
        use:enhance={() => {
          formLoading = true;
          return async ({ update }) => {
              formLoading = false;
              update();
          };
      }}
    >
    <div class="grid w-full gap-4">
      <Label for="key" class="text-lg font-semibold text-gray-700">API Key</Label>
      <Input 
        id="key"
        type="text" 
        name="key" 
        placeholder="Enter your API key"
        class="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <p class="text-sm text-gray-500">Enter your API key to connect with your remote store.</p>
    </div>

    {#if form?.message}
      <p class="text-sm text-red-600 font-medium">{form.message}</p>
    {/if}

    <Button type="submit" disabled={formLoading} variant="outline" class="w-full bg-black hover:bg-neutral-800 transition py-3 text-white hover:text-white rounded-md">
      {#if formLoading}
          Loading...
      {:else}
          submit
      {/if}
    </Button>
  </form>
</div>
