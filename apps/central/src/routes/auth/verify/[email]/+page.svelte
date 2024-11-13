<script lang="ts">
	import { showToast } from '$client/utils.client';
	import Otp from '$client/components/otp/defaultOtp.svelte';
	import { isNumberSchema } from '$global/zod';
	import MailBox from '$assets/images/mailBox.svg';
	import EmailSent from '$assets/images/mailSent.svg';
	import SyncButton from '$client/components/button/syncButton.svelte';
	import SendIcon from '$client/icons/sendIcon.svelte';
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	let otpString = '';
	let state: 'send' | 'verify' = 'send';
	const sendEnhance: SubmitFunction = async () => {
		return ({ result }) => {
			if (result.type == 'failure') showToast('Failure', 'Failed to send you an email', 'danger');
			else if (result.type == 'success') {
				state = 'verify';
				showToast('Success', 'We sent you an email.', 'success');
			}
		};
	};
	const verifyEnhance: SubmitFunction = async ({ formData }) => {
		formData.append('otp', otpString);
		return ({ result, update }) => {
			if (result.type == 'failure' && result.data) {
				otpString = '';
				showToast('Failure', result.data.message, 'danger');
			}
			update();
		};
	};
</script>

<div class="emailVerification">
	<div class="wrapper">
		{#if state == 'send'}
			<img src={MailBox} alt="Mail box" />
			<span class="message"
				>Just one more step: let's verify your. Click "Send me an email" below to receive the
				verification email in your inbox.</span
			>
			<form action="?/send" method="post" use:enhance={sendEnhance}>
				<SyncButton text="Send me an email" icon={SendIcon} --width="80%" />
			</form>
		{:else}
			<img src={EmailSent} alt="Email sent" />
			<span class="message">
				An email has been sent to <span class="email">{$page.params.email}</span>. If you have not
				yet received it, we recommend checking your spam folder. Once located, please proceed by
				copying the verification code and pasting it below.</span
			>
			<form action="?/verify" method="post" use:enhance={verifyEnhance}>
				<Otp validator={(val) => isNumberSchema.safeParse(val).success} bind:otpString />
				<SyncButton text="Verify the code" --width="80%" />
			</form>
			<form action="?/send" method="post" use:enhance={sendEnhance}>
				<SyncButton text="Resend email" icon={SendIcon} type="passive" --width="80%" />
			</form>
		{/if}
	</div>
</div>

<Toaster duration={3500} expand />

<style>
	.emailVerification {
		background-color: var(--backgroundColor);
		width: 100svw;
		height: 100svh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.wrapper {
		width: 40%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}
	.wrapper img {
		width: 280px;
		object-fit: contain;
		object-position: center;
		aspect-ratio: 1/1;
	}
	.wrapper form {
		display: contents;
	}
	.wrapper .message {
		color: var(--foregroundColor);
		hyphens: auto;
		text-align: center;
	}

	.wrapper .message .email {
		color: var(--primaryColor);
	}

	@media screen and (max-width: 768px) {
		.wrapper {
			width: 95%;
		}
	}
</style>
