<script>
	import ValidIcon from '../../icons/validIcon.svelte';

	/**@type {import("../../types").checkItem}*/
	export let checkItem;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class:disabled={checkItem.disabled} class="checkListItem" on:click>
	<button
		type="button"
		class="checkBox"
		role="checkbox"
		aria-checked={checkItem.checked}
		class:checked={checkItem.checked}
	>
		{#if checkItem.checked}
			<ValidIcon />
		{/if}
	</button>
	<div class="label">
		<label for="checkbox">{checkItem.text}</label>
		{#if checkItem.description}
			<span>{checkItem.description}</span>
		{/if}
	</div>
</div>

<style>
	.checkListItem {
		display: grid;
		grid-template-columns: auto auto;
		align-items: center;
		justify-content: start;
		gap: 0.5rem;
		--text: var(--foregroundColor);
		--main-color: var(--primaryColor);
	}

	.disabled {
		--text: var(--mutedColor);
		--main-color: var(--mutedColor);
	}

	.checkBox {
		width: 1.25rem;
		aspect-ratio: 1/1;
		display: flex;
		align-items: center;
		background-color: transparent;
		border: 2px solid var(--main-color);
		border-radius: 0.25rem;
		outline: none;
		cursor: pointer;
	}

	.checkBox :global(svg) {
		width: 1rem;
		height: 1rem;
		--icon: var(--backgroundColor);
	}

	.checked {
		background-color: var(--main-color);
	}
	.label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.label label,
	.label span {
		font-family: var(--bodyFont);
		font-size: var(--body);
	}
	.label label {
		color: var(--text);
	}
	.label span {
		color: var(--mutedColor);
	}

	.disabled button {
		cursor: not-allowed;
	}
</style>
