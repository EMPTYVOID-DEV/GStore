<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$client/components/ui/card';
	import UploadPopup from '$client/components/UploadPopup.svelte';
	import FileSearch from '$client/components/FileSearch.svelte';
	import FileTable from '$client/components/FileTable.svelte';
    import Button from '$client/components/ui/button/button.svelte';

	export let data: { 
		files: Array<{ id: string; name: string; extension: string }> 
	};

	export let form

	let files = data.files;
	let searchTerm = '';

	$: filteredFiles = files.filter(file => 
		file.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	let isModalVisible = false;

	const closeModal = () => {
		isModalVisible = false;
	};
</script>

<Card class="w-full m-4 max-w-6xl mx-auto">
	<CardHeader>
		<CardTitle>File Management</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="flex justify-end mb-4">
			<Button on:click={() => (isModalVisible = true)}>Upload File</Button>
		</div>

		<FileSearch bind:searchTerm />

		<FileTable {filteredFiles} />
	</CardContent>
</Card>

<UploadPopup 
	isVisible={isModalVisible} 
	onClose={closeModal}
	{form}
/>