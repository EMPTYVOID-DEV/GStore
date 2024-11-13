<script lang="ts">
	import { enhance } from '$app/forms';
	import SyncButton from '$client/components/button/syncButton.svelte';
	import ReactiveInput from '$client/components/input/reactiveInput.svelte';
	import { showToast } from '$client/utils.client';
	import { emailSchema, getValidator, passwordSchema, usernameSchema } from '$global/zod';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Toaster } from 'svelte-sonner';
	import { quadInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	const emailValidator = getValidator(emailSchema);
	const usernameValidator = getValidator(usernameSchema);
	const passwordValidator = getValidator(passwordSchema);

	const handleAction: SubmitFunction = async () => {
		return ({ result, update }) => {
			if (result.type === 'failure' && result.data) {
				showToast('Error', result.data.message, 'danger');
			}
			update({ reset: false });
		};
	};

	let state: 'Sign up' | 'Sign in' = 'Sign up';
</script>

<div class="auth">
	<div class="gradient-overlay" />
	<a href="/" in:fly={{ y: -20, duration: 700 }}>
		<h1>GStore</h1>
	</a>

	{#key state}
		<form
			action={`?/${state}`}
			method="post"
			use:enhance={handleAction}
			in:fade={{ duration: 800, easing: quadInOut }}
		>
			{#if state === 'Sign up'}
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
				checkFunction={passwordValidator}
				name="password"
			/>

			<span class="toggle-text">
				{#if state === 'Sign up'}
					You already have an account?
					<span class="control" on:click={() => (state = 'Sign in')}>Login</span>
				{:else}
					Don't have an account?
					<span class="control" on:click={() => (state = 'Sign up')}>Sign up</span>
				{/if}
			</span>

			<SyncButton text={state} --padding-block="0.8rem" --padding-inline="2rem" />
		</form>
	{/key}
</div>

<Toaster duration={3500} expand />

<style>
	.auth {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: var(--backgroundColor);
		gap: 2rem;
		position: relative;
		overflow: hidden;
	}

	.gradient-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at 50% 10%, var(--primaryColor) 30%, transparent 70%);
		opacity: 0.1;
		pointer-events: none;
	}

	.auth h1 {
		color: var(--foregroundColor);
		text-shadow: 0 2px 4px var(--backgroundColor);
		transition: transform 0.3s ease;
	}

	.auth h1:hover {
		transform: scale(1.05);
	}

	.auth form {
		width: 40%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.toggle-text {
		color: var(--foregroundColor);
		text-align: center;
		margin-top: 0.5rem;
	}

	.control {
		color: var(--primaryColor);
		cursor: pointer;
		margin-left: 0.5rem;
		font-weight: 500;
		transition: opacity 0.2s ease;
	}

	.control:hover {
		opacity: 0.8;
	}

	@media screen and (max-width: 768px) {
		.auth form {
			width: 90%;
		}
	}
</style>
