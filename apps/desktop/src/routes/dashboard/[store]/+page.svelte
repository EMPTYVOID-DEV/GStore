<script lang="ts">
	export let data: { files: Array<{ id: string; name: string; extension: string }> };

	$: files = data.files;

</script>

<form method="POST" enctype="multipart/form-data" action="?/upload">
	<label>
		Choose file:
		<input type="file" name="file" required />
	</label>

	<label>
		Make Public:
		<input type="checkbox" name="isPublic" value="true" />
	</label>

	<label>
		Tags (comma-separated):
		<input type="text" name="tags" placeholder="e.g., document, important" />
	</label>

	<label>
		Apikey
		<input type="text" name="apiKey"/>
	</label>

	<button type="submit">Upload</button>
</form>

{#if files && files.length > 0}
	<ul>
		{#each files as file}
			<li class="flex">
				<span>{file.name}</span>
				<span>{file.extension}</span>

				<form method="POST" action="?/delete">
					<input type="hidden" name="fileId" value="{file.id}" />
					<span>Apikey</span>
					<input type="text" name="apiKey"/>
					<button type="submit" class="bg-red-400">Delete</button>
				</form>
			</li>
		{/each}
	</ul>
{:else}
	<p>No files found for this store.</p>
{/if}
