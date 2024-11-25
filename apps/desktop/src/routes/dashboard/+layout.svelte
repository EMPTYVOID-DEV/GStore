<script>
    import Button from "$client/components/ui/button/button.svelte";

	const navigateToHome = () => {
		window.location.href = '/';
	};
</script>

<div class="min-h-screen flex flex-col">
	<nav class="bg-white px-4 py-2 shadow-md">
		<div class="container mx-auto flex justify-between items-center">
			<h1 class="text-lg text-black font-bold">GStore</h1>
			<Button
                variant="default" 
				class="text-white py-1 px-3 rounded-md transition" 
				on:click={navigateToHome}
			>
				Back
			</Button>
		</div>
	</nav>
	<main class="flex-grow p-4">
		<slot />
	</main>
</div>
