<script lang="ts">
	import type { Permissions } from '$global/types.global';
	import { slide } from 'svelte/transition';
	import DeleteIcon from '$client/icons/deleteIcon.svelte';
	import DownIcon from '$client/icons/downIcon.svelte';
	import UpIcon from '$client/icons/upIcon.svelte';
	import { enhance } from '$app/forms';
	import { showToast } from '$client/utils.client';
	import { Toaster } from 'svelte-sonner';

	export let toggleState: (index: number) => void;
	export let keys: {
		seeMore: boolean;
		name: string;
		expiresAt: Date;
		permissions: Permissions[];
	}[];
	const TOAST_DURATION = 3500;
</script>

<div class="keys-container">
	{#each keys as key, i}
		<div class="key-card">
			<div class="key-header">
				<div class="key-info">
					<span class="key-name">{key.name}</span>
					<span class="key-expiry">Expires: {key.expiresAt}</span>
				</div>
				<div class="key-actions">
					<button class="icon-button" on:click={() => toggleState(i)}>
						<svelte:component this={key.seeMore ? UpIcon : DownIcon} />
					</button>
					<form
						action="?/delete"
						method="post"
						use:enhance={({ formData }) => {
							formData.append('name', key.name);
							return ({ result, update }) => {
								if (result.type == 'success')
									showToast('Success', 'Api key has been deleted', 'success');
								update();
							};
						}}
					>
						<button class="icon-button delete">
							<DeleteIcon --icon="var(--dangerColor)" />
						</button>
					</form>
				</div>
			</div>

			{#if key.seeMore}
				<div class="key-permissions" transition:slide={{ duration: 300 }}>
					<h4>Permissions:</h4>
					<span>{key.permissions.join(' , ')}</span>
				</div>
			{/if}
		</div>
	{/each}
</div>

<Toaster expand duration={TOAST_DURATION} />

<style>
	:is(span, h4) {
		color: var(--foregroundColor);
	}

	.keys-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.key-card {
		--card-bg: color-mix(in srgb, var(--primaryColor) 15%, transparent);
		background-color: var(--card-bg);
		border: 1px solid color-mix(in srgb, var(--primaryColor) 30%, transparent);
		border-radius: var(--border-radius);
		transition: background-color 0.2s ease;
	}

	.key-card:hover {
		--card-bg: color-mix(in srgb, var(--primaryColor) 20%, transparent);
	}

	.key-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
	}

	.key-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.key-name {
		font-weight: bold;
		text-transform: capitalize;
	}

	.key-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: var(--border-radius);
		transition: background-color 0.2s ease;
	}

	.icon-button:hover {
		background-color: color-mix(in srgb, var(--primaryColor) 30%, transparent);
	}

	.icon-button.delete:hover {
		background-color: color-mix(in srgb, var(--dangerColor) 30%, transparent);
	}

	.icon-button :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
		--icon: var(--foregroundColor);
	}

	.key-permissions {
		padding: 1rem;
		border-top: 1px solid color-mix(in srgb, var(--primaryColor) 30%, transparent);
		background-color: color-mix(in srgb, var(--primaryColor) 10%, transparent);
	}
</style>
