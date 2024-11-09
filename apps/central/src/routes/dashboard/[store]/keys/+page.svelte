<script lang="ts">
	import SyncButton from '$client/components/button/syncButton.svelte';
	import DefaultCopy from '$client/components/copy/defaultCopy.svelte';
	import StaticInput from '$client/components/input/staticInput.svelte';
	import PlusIcon from '$client/icons/plusIcon.svelte';
	import KeyContainer from './components/keyContainer.svelte';
	import KeyForm from './components/keyForm.svelte';

	export let data;

	export let form: string;

	let state: 'init' | 'created' | 'creating' = 'init';

	function handleChange({ currentTarget }: Event & { currentTarget: { value: string } }) {
		keys = data.apiKeys
			.filter((key) => key.name.includes(currentTarget.value))
			.map((k) => ({ ...k, seeMore: false }));
	}

	function toggleState(index: number) {
		keys[index].seeMore = !keys[index].seeMore;
		keys = keys;
	}

	$: keys = data.apiKeys.map((k) => ({ ...k, seeMore: false }));
</script>

<div class="search-bar">
	<StaticInput label="Search an api key" on:input={handleChange} />
	<SyncButton
		type="primary"
		text="Create a key"
		icon={PlusIcon}
		--padding-block="0.7rem"
		on:click={() => (state = 'creating')}
	/>
</div>

{#if state == 'created'}
	<div class="keyValue">
		<h4>This is the api key value. Copy it and keep it secret , it won't be shown again.</h4>
		<DefaultCopy text={form} />
	</div>
{/if}

{#if state == 'creating'}
	<KeyForm changeState={() => (state = 'created')} />
{/if}

<KeyContainer {keys} {toggleState} />

<style>
	.search-bar {
		display: flex;
		width: 100%;
		align-items: end;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.keyValue {
		--bg-opacity: 8%;
		background-color: color-mix(in srgb, var(--primaryColor) var(--bg-opacity), transparent);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		border-radius: var(--border-radius);
	}

	.keyValue h4 {
		color: var(--foregroundColor);
	}
</style>
