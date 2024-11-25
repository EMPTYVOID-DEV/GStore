<script lang="ts">
	import { Button } from '$client/components/ui/button';
	import { Input } from '$client/components/ui/input';
	import { Label } from '$client/components/ui/label';
	import { Checkbox } from '$client/components/ui/checkbox';
	import { enhance } from '$app/forms';

	export let isVisible: boolean;
	export let onClose: () => void;
	export let form
	
	let formLoading: boolean = false;

	const close = () => {
		if (onClose) {
			onClose();
		}
	};
</script>

{#if isVisible}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
		<div class="bg-white rounded shadow-lg p-6 w-full max-w-md">
			<h2 class="text-xl font-bold mb-4">Upload File</h2>
			<form 
				method="POST" 
				enctype="multipart/form-data" 
				action="?/upload"
				class="space-y-4"
				use:enhance={() => {
					formLoading = true;
					return async ({ update }) => {
						formLoading = false;
						update();
					};
				}}
			>
				<div class="space-y-2">
					<Label>Choose file</Label>
					<Input type="file" name="file" required />
				</div>

				<div class="flex items-center space-x-2">
					<Checkbox name="isPublic" id="isPublic" />
					<Label for="isPublic">Make Public</Label>
				</div>

				<div class="space-y-2">
					<Label>Tags (comma-separated)</Label>
					<Input type="text" name="tags" placeholder="e.g., document, important" />
				</div>

				<div class="flex w-full gap-4 justify-between">
					<Button 
						type="button" 
						on:click={close} 
						variant="secondary"
						class="w-1/2"
					>
						Cancel
					</Button>
					<Button 
						type="submit" 
						disabled={formLoading} 
						class="w-1/2 bg-black hover:bg-neutral-800 transition py-3 text-white hover:text-white rounded-md"
					>
						{#if formLoading}
							Loading...
						{:else}
							Submit
						{/if}
					</Button>
				</div>
			</form>
			{#if form?.message}
				<p class="text-sm text-red-600 mt-6 font-medium">{form.message}</p>
			{/if}
		</div>
	</div>
{/if}
