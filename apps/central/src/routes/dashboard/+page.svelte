<script lang="ts">
	import type { iconComponent } from '$client/types.js';
	import DefaultTabs from '$client/components/tabs/defaultTabs.svelte';
	import ProfileIcon from '$client/icons/profileIcon.svelte';
	import StorageIcon from '$client/icons/storageIcon.svelte';
	import StoresTab from './components/storesTab.svelte';
	import ProfileTab from './components/profileTab.svelte';
	import AdminIcon from '$client/icons/adminIcon.svelte';
	import AdmintTab from './components/admintTab.svelte';

	export let data;

	let activeTab = 0;

	const tabs: { icon: iconComponent; title: string }[] = [
		{ icon: StorageIcon, title: 'Stores' },
		{ icon: ProfileIcon, title: 'Profile' }
	];

	if (data.isAdmin) tabs.splice(1, 0, { title: 'Admin', icon: AdminIcon });
</script>

<div class="dashboard">
	<DefaultTabs bind:activeTab {tabs} />

	{#if data.isAdmin}
		{#if activeTab === 0}
			<StoresTab />
		{:else if activeTab === 1}
			<AdmintTab />
		{:else}
			<ProfileTab />
		{/if}
	{:else if activeTab === 0}
		<StoresTab />
	{:else}
		<ProfileTab />
	{/if}
</div>

<style>
	.dashboard {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--backgroundColor);
		gap: 1rem;
		padding-block: 1rem;
		padding-inline: 5%;
	}
</style>
