<script lang="ts">
	import DefaultDialog from '$client/components/dialog/defaultDialog.svelte';
	import StaticInput from '$client/components/input/staticInput.svelte';
	import ReactiveInput from '$client/components/input/reactiveInput.svelte';
	import SyncButton from '$client/components/button/syncButton.svelte';
	import PlusIcon from '$client/icons/plusIcon.svelte';
	import RightArrowIcon from '$client/icons/rightArrowIcon.svelte';
	import { Toaster } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { quadInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { showToast } from '$client/utils.client.js';
	import type { ActionStatus, Store } from '$global/types.global';

	export let handleChange: (e: Event & { currentTarget: { value: string } }) => void;
	export let storeNameValidator: (text: string) => ActionStatus;
	export let stores: Store[];

	const TRANSITION_DURATION = 520;
	const TOAST_DURATION = 3500;
</script>

<div class="search-bar">
	<StaticInput label="Search a store" on:input={handleChange} />

	<DefaultDialog let:close>
		<svelte:fragment let:open slot="trigger">
			<SyncButton
				type="primary"
				text="Create a store"
				icon={PlusIcon}
				on:click={open}
				--padding-block="0.7rem"
			/>
		</svelte:fragment>

		<form
			use:enhance={() => {
				return ({ result, update }) => {
					if (result.type === 'failure' && typeof result.data?.message === 'string') {
						showToast('Error', result.data.message, 'danger');
					} else {
						close();
						update();
					}
				};
			}}
			action="?/create"
			method="post"
			class="create-store-form"
			transition:scale={{
				duration: TRANSITION_DURATION,
				easing: quadInOut,
				start: 0,
				opacity: 0.2
			}}
		>
			<h3>Create a new store</h3>
			<ReactiveInput checkFunction={storeNameValidator} label="Store name" name="name" />
			<SyncButton text="Create a store" --width="100%" />
		</form>

		<Toaster expand duration={TOAST_DURATION} />
	</DefaultDialog>
</div>

<div class="store-list">
	{#each stores as store}
		<a
			class="store-card"
			href={`/dashboard/${store.id}/settings`}
			title={`Open ${store.name} settings`}
		>
			<div class="store-info">
				<h4>{store.name}</h4>
				<span>Creation Date: {store.creationDate}</span>
			</div>
			<RightArrowIcon />
		</a>
	{/each}
</div>

<style>
	:is(span, h3, h4) {
		color: var(--foregroundColor);
	}

	.search-bar {
		display: flex;
		width: 100%;
		align-items: end;
		gap: 1rem;
	}

	.create-store-form {
		width: 40vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.store-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.store-card {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background-color: color-mix(in srgb, var(--primaryColor) 30%, transparent);
		border-radius: var(--border-radius);
		border: 0.125rem solid var(--primaryColor);
		cursor: pointer;
		text-decoration: none;
		transition: transform 0.2s ease-in-out;
	}

	.store-card:hover {
		transform: translateY(-2px);
	}

	.store-card :global(svg) {
		width: 2rem;
		height: 2rem;
		transition: transform 0.2s ease-in-out;
	}

	.store-card:hover :global(svg) {
		transform: translateX(4px);
	}

	.store-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	@media (max-width: 768px) {
		.search-bar {
			align-items: flex-start;
			flex-direction: column;
			--width: 100%;
		}

		.create-store-form {
			width: 90vw;
		}
	}
</style>
