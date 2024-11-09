<script>
	import SyncButton from '$client/components/button/syncButton.svelte';
	import RightArrowIcon from '$client/icons/rightArrowIcon.svelte';

	export let data;
</script>

<div class="home">
	<h1>GStore</h1>
	<p>
		GStore is a self-hosted storage solution for institutions, companies, and developers. It
		provides a central management interface and API to handle file storage, with advanced features
		like file transformations and fine-grained access control.
	</p>
	<a href={data.username ? '/dashboard' : '/auth'}>
		<SyncButton text="Get Started" icon={RightArrowIcon} />
	</a>
</div>

<style>
	.home {
		width: 100svw;
		height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: var(--backgroundColor);
		gap: 1rem;
	}

	.home h1 {
		font-size: var(--huge);
		color: var(--foregroundColor);
	}
	.home p {
		text-align: center;
		color: var(--mutedColor);
		text-wrap: balance;
	}
</style>
