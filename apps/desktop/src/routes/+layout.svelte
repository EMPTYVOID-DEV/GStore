<script lang="ts">
    import { Toaster } from 'svelte-sonner';
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
<Toaster />