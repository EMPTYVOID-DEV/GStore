<script lang="ts">
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$client/components/ui/table';
	import { Button } from '$client/components/ui/button';
    import { enhance } from '$app/forms';

	export let filteredFiles: Array<{ apiKey?: string, id: string; name: string; extension: string; tags: string[] }>;
	export let action: string
	console.log(action)
	$: processedFiles = filteredFiles.map((file) => ({
		...file,
		joinedTags: file.tags.join(", "),
	}));

	let formLoading: boolean = false;
</script>

{#if processedFiles.length > 0}
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Name</TableHead>
				<TableHead>Extension</TableHead>
				<TableHead>Tags</TableHead>
				<TableHead class="text-right">Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each processedFiles as file}
				<TableRow>
					<TableCell>{file.name}</TableCell>
					<TableCell>{file.extension}</TableCell>
					<TableCell>{file.joinedTags}</TableCell>
					<TableCell class="text-right">
						<form 
							method="POST" 
							action={`?/${action}`}
							class="inline-flex items-center space-x-2"
							on:submit|preventDefault
							use:enhance={() => {
								formLoading = true;
								return async ({ update }) => {
									formLoading = false;
									update();
								};
							}}
						>
							<input type="hidden" name="fileId" value={file.id} />
							<Button disabled={formLoading} type="submit" variant="destructive">
								Delete
							</Button>
						</form>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
{:else}
	<p class="text-center text-muted-foreground">No files found for this store.</p>
{/if}
