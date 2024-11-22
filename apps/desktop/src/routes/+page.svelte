<script lang="ts">
    import { goto } from '$app/navigation';
    import { redirect } from '@sveltejs/kit';

    export let form
</script>

<form method="POST" action="?/access_store">
    <span>Enter your key:</span>
    <input 
      type="text" 
      name="key" 
      placeholder="Enter your API key"
      class="border border-black" 
      required
    />
    <button type="submit">Submit</button>
    
    {#if form?.message}
      <p class="text-red-500">{form.message}</p>
    {/if}
</form>