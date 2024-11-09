<script lang="ts">
	import { enhance } from '$app/forms';
	import SyncButton from '$client/components/button/syncButton.svelte';
	import DefaultDialog from '$client/components/dialog/defaultDialog.svelte';
	import { quadInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let data;

	const TRANSITION_DURATION = 520;
</script>

<div class="info">
	<h4>Store name : {data.store?.name}</h4>
	<h4>Creation date : {data.store?.creationDate}</h4>
</div>

<div class="delete-container">
	<header class="delete-header">
		<h3>Delete</h3>
		<p>
			This action will delete the store and all its files permanently. This action cannot be undone.
		</p>
	</header>

	<DefaultDialog let:close>
		<svelte:fragment slot="trigger" let:open>
			<div class="trigger-container">
				<SyncButton text="Delete a store" type="danger" on:click={open} />
			</div>
		</svelte:fragment>

		<form
			use:enhance={() => {
				return ({ update }) => {
					close();
					update();
				};
			}}
			action="?/delete"
			method="post"
			class="delete-form"
			transition:scale={{
				duration: TRANSITION_DURATION,
				easing: quadInOut,
				start: 0,
				opacity: 0.2
			}}
		>
			<h3>Delete A Store</h3>
			<p>This action will erase all files of this store.</p>

			<div class="button-group">
				<SyncButton
					text="Cancel"
					type="passive"
					on:click={(e) => {
						e.preventDefault();
						close();
					}}
				/>
				<SyncButton text="Confirm" type="danger" />
			</div>
		</form>
	</DefaultDialog>
</div>

<style>
	:is(h3, p, h4) {
		color: var(--foregroundColor);
		margin: 0;
	}

	.info {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.delete-container {
		--bg-opacity: 8%;
		background-color: color-mix(in srgb, var(--primaryColor) var(--bg-opacity), transparent);
		width: 100%;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--mutedColor);
		border-radius: var(--border-radius);
		gap: 1rem;
	}

	.delete-header {
		display: flex;
		flex-direction: column;
		padding: 0.75rem;
		gap: 0.75rem;
	}

	.trigger-container {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		padding: 0.75rem;
		border-top: 1px solid var(--mutedColor);
	}

	.delete-form {
		width: 40vw;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background-color: color-mix(in srgb, var(--dangerColor) 60%, var(--foregroundColor));
		border-radius: var(--border-radius);
		padding: 1rem;
	}

	.button-group {
		display: flex;
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.delete-form {
			width: 90vw;
		}
	}
</style>
