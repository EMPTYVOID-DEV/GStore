<script lang="ts">
	import DefaultDialog from '$client/components/dialog/defaultDialog.svelte';
	import StaticInput from '$client/components/input/staticInput.svelte';
	import ReactiveInput from '$client/components/input/reactiveInput.svelte';
	import SyncButton from '$client/components/button/syncButton.svelte';
	import PlusIcon from '$client/icons/plusIcon.svelte';
	import DeleteIcon from '$client/icons/deleteIcon.svelte';
	import { Toaster } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { quadInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { showToast } from '$client/utils.client';
	import { getValidator, passwordSchema, usernameSchema } from '$global/zod';
	import { page } from '$app/stores';
	import type { SubmitFunction } from '@sveltejs/kit';

	const passwordValidator = getValidator(passwordSchema);
	const usernameValidator = getValidator(usernameSchema);
	const TRANSITION_DURATION = 520;
	const TOAST_DURATION = 3500;

	const createAction = (close: () => void): SubmitFunction => {
		return () =>
			({ result, update }) => {
				if (result.type === 'failure' && typeof result.data?.message === 'string') {
					showToast('Error', result.data.message, 'danger');
				} else {
					close();
					update();
				}
			};
	};
	const deleteAction = (username: string): SubmitFunction => {
		return ({ formData }) => {
			formData.append('username', username);
			return ({ result, update }) => {
				if (result.type == 'success') showToast('Success', 'User was deleted', 'success');
				update();
			};
		};
	};

	const filterUsers = (event: Event) => {
		const value = (event.target as HTMLInputElement).value;
		users = $page.data.users!.filter((user) => user.username.includes(value));
	};

	$: users = $page.data.users!;
</script>

<div class="search-bar">
	<StaticInput label="Search a user" on:input={filterUsers} />

	<DefaultDialog let:close>
		<svelte:fragment let:open slot="trigger">
			<SyncButton
				type="primary"
				text="Create a regular user"
				icon={PlusIcon}
				on:click={open}
				--padding-block="0.7rem"
			/>
		</svelte:fragment>

		<form
			use:enhance={createAction(close)}
			action="?/create_user"
			method="post"
			class="create-user-form"
			transition:scale={{
				duration: TRANSITION_DURATION,
				easing: quadInOut,
				start: 0,
				opacity: 0.2
			}}
		>
			<h3>Create a new regular user</h3>

			<ReactiveInput
				inputType="text"
				label="Username"
				checkFunction={usernameValidator}
				name="username"
			/>

			<ReactiveInput
				inputType="password"
				label="Password"
				checkFunction={passwordValidator}
				name="password"
			/>

			<SyncButton text="Create a user" --width="100%" />
		</form>

		<Toaster expand duration={TOAST_DURATION} />
	</DefaultDialog>
</div>

<div class="user-list">
	{#each users as user}
		<div class="user">
			<span>{user.username}</span>
			{#if user.username != $page.data.username}
				<form action="?/delete_user" method="post" use:enhance={deleteAction(user.username)}>
					<button>
						<DeleteIcon --icon="var(--dangerColor)" />
					</button>
				</form>
			{/if}
		</div>
	{/each}
</div>

<style>
	:is(span, h3) {
		color: var(--foregroundColor);
	}

	.search-bar {
		display: flex;
		width: 100%;
		align-items: end;
		gap: 1rem;
	}

	.create-user-form {
		width: 40vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.user-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.user {
		display: flex;
		justify-content: space-between;
		padding: 0.75rem;
		align-items: center;
		background-color: color-mix(in srgb, var(--primaryColor) 30%, transparent);
		border-radius: var(--border-radius);
		border: 0.125rem solid var(--primaryColor);
	}

	.user span {
		color: var(--foregroundColor);
	}

	.user button {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: var(--border-radius);
	}

	.user button:hover {
		background-color: color-mix(in srgb, var(--dangerColor) 30%, transparent);
	}

	@media (max-width: 768px) {
		.search-bar {
			align-items: flex-start;
			flex-direction: column;
			width: 100%;
		}

		.create-user-form {
			width: 90vw;
		}
	}
</style>
