<script lang="ts">
	import { enhance } from '$app/forms';
	import SyncButton from '$client/components/button/syncButton.svelte';
	import ReactiveInput from '$client/components/input/reactiveInput.svelte';
	import { showToast } from '$client/utils.client';
	import { getValidator, passwordSchema, usernameSchema } from '$global/zod';
	import { Toaster } from 'svelte-sonner';
	import { quadInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import type { SubmitFunction } from '@sveltejs/kit';

	const usernameValidator = getValidator(usernameSchema);
	const passwordValidator = getValidator(passwordSchema);

	const handleAction: SubmitFunction = async ({ formData }) => {
		return ({ result, update }) => {
			if (result.type === 'failure' && result.data) {
				showToast('Error', result.data.message, 'danger');
			}
			update({ reset: false });
		};
	};
</script>

<div class="auth">
	<div class="gradient-overlay"></div>
	<a href="/" in:fly={{ y: -20, duration: 700 }}>
		<h1>GStore</h1>
	</a>

	<form
		action="?/login"
		method="post"
		use:enhance={handleAction}
		in:fade={{ duration: 800, easing: quadInOut }}
	>
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

		<SyncButton text="Login" --padding-block="0.8rem" --padding-inline="2rem" />
	</form>
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
	@media screen and (max-width: 768px) {
		.auth form {
			width: 90%;
		}
	}
</style>
