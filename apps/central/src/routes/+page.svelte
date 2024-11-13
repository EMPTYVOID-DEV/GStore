<script lang="ts">
	import SyncButton from '$client/components/button/syncButton.svelte';
	import RightArrowIcon from '$client/icons/rightArrowIcon.svelte';

	export let data;

	const cards: { title: string; desc: string }[] = [
		{
			title: 'Central Management',
			desc: 'Manage virtual stores, create API keys with specific permissions, and handle user authentication through a unified interface.'
		},
		{
			title: 'Advanced Transformations',
			desc: 'Built-in support for image resizing, PDF merging, video encoding, and more - all through a simple API interface.'
		},
		{
			title: 'Flexible Storage',
			desc: 'Support for both public and private files with metadata tracking, tagging system, and efficient file organization.'
		},
		{
			title: 'Self Hosted',
			desc: 'Deploy anywhere using Docker Compose with automatic SSL certificate management via Traefik.'
		},
		{
			title: 'Extensible Architecture',
			desc: 'Built for expansion with support for additional apps like backup CLI tools and desktop management interfaces.'
		},
		{
			title: 'Developer Friendly',
			desc: 'Complete API documentation, Zod validation, rate limiting, and fine-grained access control through API keys.'
		}
	];
</script>

<div class="home">
	<div class="gradient-overlay"></div>
	<h1>GStore an easy way to store files</h1>
	<p>
		GStore is a self-hosted storage solution for institutions, companies, and developers. It
		provides a central management interface and API to handle file storage, with advanced features
		like file transformations and fine-grained access control.
	</p>
	<a href={data.username ? '/dashboard' : '/auth'}>
		<SyncButton
			text="Get Started"
			icon={RightArrowIcon}
			--padding-block="0.8rem"
			--padding-inline="0.8rem"
		/>
	</a>
	<div class="cards">
		{#each cards as card}
			<div class="card">
				<span class="title">{card.title}</span>
				<span class="desc">{card.desc}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.home {
		width: 100svw;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: var(--backgroundColor);
		gap: 2rem;
		padding-block: 2rem;
		position: relative;
		overflow: hidden;
	}

	.gradient-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at 50% 0%, var(--primaryColor) 30%, transparent 70%);
		opacity: 0.1;
		pointer-events: none;
	}

	.home h1 {
		color: var(--primaryColor);
		text-align: center;
		margin-bottom: 1rem;
		position: relative;
		z-index: 1;
	}

	.home p {
		text-align: center;
		color: var(--mutedColor);
		text-wrap: balance;
		max-width: 800px;
		line-height: 1.6;
		position: relative;
		z-index: 1;
	}

	.cards {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		padding-inline: 5%;
		gap: 2rem;
		position: relative;
		z-index: 1;
	}

	.card {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		gap: 1rem;
		background: var(--primaryColor);
		border-radius: var(--border-radius);
		box-shadow: 0 4px 6px var(--backgroundColor);
		transition:
			transform 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
	}

	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 12px var(--backgroundColor);
	}

	.card .title {
		font-weight: bold;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--backgroundColor);
		color: var(--backgroundColor);
		opacity: 0.9;
	}

	.card .desc {
		color: var(--backgroundColor);
		line-height: 1.5;
		opacity: 0.8;
	}

	@media screen and (width < 1024px) {
		.cards {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media screen and (width < 764px) {
		.cards {
			grid-template-columns: 1fr;
		}

		.home h1 {
			padding-inline: 1rem;
		}

		.home p {
			padding-inline: 1rem;
		}
	}
</style>
