<script lang="ts">
	import { enhance } from '$app/forms';
	import SyncButton from '$client/components/button/syncButton.svelte';
	import ReactiveInput from '$client/components/input/reactiveInput.svelte';
	import { showToast } from '$client/utils.client';
	import { emailSchema, getValidator, passwordSchema, usernameSchema } from '$global/zod';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Toaster } from 'svelte-sonner';
	let emailValidator = getValidator(emailSchema);
	let usernameValidator = getValidator(usernameSchema);
	let passwordValidtor = getValidator(passwordSchema);
	const handleAction: SubmitFunction = async () => {
		return ({ result, update }) => {
			if (result.type == 'failure' && result.data)
				showToast('Error', result.data.message, 'danger');
			update({ reset: false });
		};
	};
	let state: 'Sign up' | 'Sign in' = 'Sign up';
</script>

<div class="auth">
	<h1>GStore</h1>
	<form action={`?/${state}`} method="post" use:enhance={handleAction}>
		{#if state == 'Sign up'}
			<ReactiveInput
				inputType="text"
				label="Username"
				checkFunction={usernameValidator}
				name="username"
			/>
		{/if}
		<ReactiveInput inputType="email" label="Email" checkFunction={emailValidator} name="email" />
		<ReactiveInput
			inputType="password"
			label="Password"
			checkFunction={passwordValidtor}
			name="password"
		/>
		{#if state == 'Sign up'}
			<span
				>You already have an account ? <span class="control" on:click={() => (state = 'Sign in')}
					>Login.</span
				></span
			>
		{:else}
			<span
				>Don't have an account ? <span class="control" on:click={() => (state = 'Sign up')}
					>Sign up.</span
				></span
			>
		{/if}
		<SyncButton text={state} />
	</form>
</div>

<Toaster duration={3500} expand />

<style>
	.auth {
		width: 100svw;
		height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: var(--backgroundColor);
		gap: 1rem;
	}
	.auth h1 {
		color: var(--foregroundColor);
	}
	.auth form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 40%;
		gap: 0.75rem;
	}

	.auth span {
		color: var(--foregroundColor);
	}

	.auth .control {
		color: var(--primaryColor);
		cursor: pointer;
	}

	@media (width<768px) {
		.auth form {
			width: 90%;
		}
	}
</style>
