<script lang="ts">
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$client/components/ui/table';
	import { Button } from '$client/components/ui/button';
	import { Input } from '$client/components/ui/input';

	export let filteredFiles: Array<{ id: string; name: string; extension: string }>;
</script>

{#if filteredFiles.length > 0}
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Name</TableHead>
				<TableHead>Extension</TableHead>
				<TableHead class="text-right">Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each filteredFiles as file}
				<TableRow>
					<TableCell>{file.name}</TableCell>
					<TableCell>{file.extension}</TableCell>
					<TableCell class="text-right">
						<form 
							method="POST" 
							action="?/delete"
							class="inline-flex items-center space-x-2"
						>
							<input type="hidden" name="fileId" value={file.id} />
							<Button type="submit" variant="destructive">
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
