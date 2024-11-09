<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DefaultTabs from '$client/components/tabs/defaultTabs.svelte';
	import KeyIcon from '$client/icons/keyIcon.svelte';
	import SettingsIcon from '$client/icons/settingsIcon.svelte';
	import type { iconComponent } from '$client/types';

	const tabs: { icon: iconComponent; title: string; url: string }[] = [
		{ icon: KeyIcon, title: 'Api Keys', url: 'keys' },
		{ icon: SettingsIcon, title: 'Store Settings', url: 'settings' }
	];

	function handleChange({ detail: { activeTab } }: CustomEvent<{ activeTab: number }>) {
		const url = tabs[activeTab].url;
		goto(`/dashboard/${$page.params.store}/${url}`);
	}

	function initialTab() {
		return tabs.findIndex((tab) => $page.url.pathname.includes(tab.url));
	}
</script>

<div class="store">
	<DefaultTabs {tabs} on:change={handleChange} activeTab={initialTab()} />
	<slot></slot>
</div>

<style>
	.store {
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
