<script lang="ts">
	import SyncButton from '$client/components/button/syncButton.svelte';
	import FormWrapper from '$client/components/other/formWrapper.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	const logout: SubmitFunction = async () => {
		return ({ update }) => {
			update();
		};
	};
	export let username: string = '';
</script>

<h2 class="welcome">
	Welcome <span>{username}</span>
</h2>

<FormWrapper actionName="?/logout" action={logout} --justify="flex-end">
	<section class="input">
		<h3>Logout</h3>
		<span
			>This action will log you out from all active sessions. Do this if you need to reset your
			password, like if your account was compromised. Logging out will revoke access from anyone
			unauthorized.
		</span>
	</section>
	<svelte:fragment slot="submitter">
		<SyncButton text="Logout" type="passive" />
	</svelte:fragment>
</FormWrapper>

<style>
	.welcome {
		color: var(--foregroundColor);
	}

	.welcome span {
		color: var(--primaryColor);
		font-size: inherit;
		font-weight: inherit;
		font-family: inherit;
	}

	.input {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		gap: 0.75rem;
		--width: 50%;
	}

	.input h3,
	.input span {
		color: var(--foregroundColor);
	}

	@media screen and (max-width: 768px) {
		.input {
			--width: 80%;
		}
	}
</style>
