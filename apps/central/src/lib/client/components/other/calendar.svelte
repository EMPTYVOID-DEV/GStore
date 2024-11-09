<script lang="ts">
	export let value = '';
	export let name = '';
	export let label = '';
</script>

<div class="date-input-container">
	{#if label}
		<label for={name}>{label}</label>
	{/if}

	<input type="date" {name} bind:value />
</div>

<style>
	.date-input-container {
		position: relative;
		width: 100%;
		margin: 1rem 0;
	}

	label {
		position: absolute;
		left: 0.5rem;
		transform: translateY(-50%);
		font-size: 1rem;
		transition: all 0.2s ease-out;
		pointer-events: none;
		padding: 0 0.5rem;
		top: 0;
		font-size: 0.8rem;
		background-color: var(--backgroundColor);
		color: var(--primaryColor);
	}

	input {
		width: 100%;
		padding: 0.8rem;
		font-size: 1rem;
		background-color: transparent;
		border: 2px solid var(--mutedColor);
		border-radius: var(--border-radius);
		color: var(--foregroundColor);
		outline: none;
		transition: all 0.2s ease-out;
	}

	input:focus {
		border-color: var(--primaryColor);
	}

	/* Styling the calendar icon and dropdown */
	input::-webkit-calendar-picker-indicator {
		filter: invert(1);
		cursor: pointer;
		opacity: 0.7;
		padding: 0.2rem;
	}

	input::-webkit-calendar-picker-indicator:hover {
		opacity: 1;
	}

	/* Remove default styling on some browsers */
	input[type='date']::-webkit-datetime-edit-text,
	input[type='date']::-webkit-datetime-edit-month-field,
	input[type='date']::-webkit-datetime-edit-day-field,
	input[type='date']::-webkit-datetime-edit-year-field {
		color: var(--foregroundColor);
	}

	input[type='date']::-webkit-datetime-edit-text {
		padding: 0 0.3rem;
	}
</style>
