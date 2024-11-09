<script lang="ts">
	import type { iconComponent } from '$client/types.js';
	import DefaultTabs from '$client/components/tabs/defaultTabs.svelte';
	import ProfileIcon from '$client/icons/profileIcon.svelte';
	import StorageIcon from '$client/icons/storageIcon.svelte';
	import { getValidator, storeNameSchema } from '$global/zod.js';
	import StoresTab from './components/storesTab.svelte';
	import ProfileTab from './components/profileTab.svelte';

	export let data;

	let activeTab = 0;
	const tabs: { icon: iconComponent; title: string }[] = [
		{ icon: StorageIcon, title: 'Stores' },
		{ icon: ProfileIcon, title: 'Profile' }
	];
	const storeNameValidator = getValidator(storeNameSchema);
	function handleChange({ currentTarget }: Event & { currentTarget: { value: string } }) {
		stores = data.stores.filter((store) => store.name.includes(currentTarget.value));
	}
	$: stores = data.stores;
</script>

<div class="dashboard">
	<DefaultTabs bind:activeTab {tabs} />
	{#if activeTab == 0}
		<StoresTab {stores} {handleChange} {storeNameValidator} />
	{:else}
		<ProfileTab username={data.username} />
	{/if}
</div>

<style>
	.dashboard {
		width: 100svw;
		height: 100svh;
		display: flex;
		flex-direction: column;
		background: var(--backgroundColor);
		gap: 1rem;
		padding-block: 1rem;
		padding-inline: 5%;
	}
</style>
