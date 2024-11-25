<script lang="ts">
	import { Input } from '$client/components/ui/input';
	export let searchTerm: string;
</script>

<Input 
	placeholder="Search files..." 
	class="mb-4"
	bind:value={searchTerm}
/>
