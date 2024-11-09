<script lang="ts">
	import DefaultDialog from '$client/components/dialog/defaultDialog.svelte';
	import StaticInput from '$client/components/input/staticInput.svelte';
	import { enhance } from '$app/forms';
	import SyncButton from '$client/components/button/syncButton.svelte';
	import ReactiveInput from '$client/components/input/reactiveInput.svelte';
	import { Toaster } from 'svelte-sonner';
	import { showToast } from '$client/utils.client.js';
	import { quadInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import PlusIcon from '$client/icons/plusIcon.svelte';
	import RightArrowIcon from '$client/icons/rightArrowIcon.svelte';
	import type { ActionStatus, Store } from '$global/types.global';
	export let handleChange: (e: Event & { currentTarget: { value: string } }) => void;
	export let storeNameValidator: (text: string) => ActionStatus;
	export let stores: Store[];
</script>

<div class="bar">
	<StaticInput label="Search a store" on:input={handleChange} />
	<DefaultDialog let:close>
		<svelte:fragment let:open slot="trigger">
			<SyncButton
				--padding-block="0.7rem"
				on:click={() => open()}
				type="primary"
				text="Create a store"
				icon={PlusIcon}
			/>
		</svelte:fragment>

		<form
			use:enhance={async () => {
				return ({ result, update }) => {
					if (result.type == 'failure' && typeof result.data?.message == 'string')
						showToast('Error', result.data.message, 'danger');
					else {
						close();
						update();
					}
				};
			}}
			action="?/create"
			method="post"
			class="addStore"
			transition:scale={{ duration: 520, easing: quadInOut, start: 0, opacity: 0.2 }}
		>
			<h3>Create a new store</h3>
			<ReactiveInput checkFunction={storeNameValidator} label="Store name" name="name" />
			<SyncButton text="Create a store" --width="100%" />
		</form>
		<Toaster expand duration={3500} />
	</DefaultDialog>
</div>
<div class="stores">
	{#each stores as store}
		<a class="store" href={`/dashboard/${store.name}`}>
			<div class="info">
				<h4>{store.name}</h4>
				<span>Creation Date : {store.creationDate}</span>
			</div>
			<RightArrowIcon />
		</a>
	{/each}
</div>

<style>
	.bar {
		display: flex;
		width: 100%;
		align-items: end;
		gap: 1rem;
	}

	.addStore {
		width: 40vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.addStore h3 {
		color: var(--foregroundColor);
	}

	.stores {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.store {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		background-color: color-mix(in srgb, var(--primaryColor) 30%, transparent 70%);
		border-radius: var(--border-radius);
		border: 0.125rem solid var(--primaryColor);
		cursor: pointer;
	}

	.store :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.info h4 {
		text-transform: capitalize;
	}

	.info :is(span, h4) {
		color: var(--foregroundColor);
	}

	@media (width<768px) {
		.bar {
			align-items: flex-start;
			flex-direction: column;
			--width: 100%;
		}
		.addStore {
			width: 90vw;
		}
	}
</style>
