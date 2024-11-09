<script lang="ts">
	import { enhance } from '$app/forms';
	import SyncButton from '$client/components/button/syncButton.svelte';
	import DefaultCheckList from '$client/components/checkList/defaultCheckList.svelte';
	import ReactiveInput from '$client/components/input/reactiveInput.svelte';
	import Calendar from '$client/components/other/calendar.svelte';
	import type { checkItem } from '$client/types';
	import { showToast } from '$client/utils.client';
	import { getValidator, keyNameSchema } from '$global/zod';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Toaster } from 'svelte-sonner';

	export let changeState: () => void;

	let checkList: checkItem[] = [
		{ checked: true, text: 'read' },
		{ text: 'create', checked: false },
		{ text: 'update', checked: false },
		{ text: 'delete', checked: false },
		{ text: 'list-files', checked: false },
		{ text: 'apply-transformation', checked: false }
	];

	let keyNameValidator = getValidator(keyNameSchema);

	let expiresAt = '';

	const TOAST_DURATION = 3500;

	const createKey: SubmitFunction = async ({ formData }) => {
		const finalChecklist = checkList.filter((el) => el.checked).map((e) => e.text);
		formData.append('expiration', expiresAt);
		formData.append('permissions', JSON.stringify(finalChecklist));
		return ({ update, result }) => {
			if (result.type == 'success') {
				changeState();
				showToast('Success', 'Api key has been created', 'success');
			}
			if (result.type == 'failure' && result.data?.message)
				showToast('Error', result.data.message, 'danger');
			update();
		};
	};
</script>

<form method="post" action="?/create" class="creating" use:enhance={createKey}>
	<h3>Creation Form</h3>
	<ReactiveInput checkFunction={keyNameValidator} inputType="text" name="name" label="Key Name" />
	<DefaultCheckList {checkList} />
	<Calendar label="Expiration Date" bind:value={expiresAt} />
	<SyncButton text="Create" type="primary" />
</form>

<Toaster expand duration={TOAST_DURATION} />

<style>
	.creating {
		--bg-opacity: 8%;
		background-color: color-mix(in srgb, var(--primaryColor) var(--bg-opacity), transparent);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		border-radius: var(--border-radius);
	}

	h3 {
		color: var(--foregroundColor);
	}
</style>
