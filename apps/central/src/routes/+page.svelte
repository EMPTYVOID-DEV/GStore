<script lang="ts">
	import SyncButton from '$client/components/button/syncButton.svelte';
	import RightArrowIcon from '$client/icons/rightArrowIcon.svelte';
	import management from '$client/icons/home/managementIcon.svelte';
	import transformations from '$client/icons/home/transformationIcon.svelte';
	import storage from '$client/icons/storageIcon.svelte';
	import hosting from '$client/icons/home/hostingIcon.svelte';
	import architecture from '$client/icons/home/architectureIcon.svelte';
	import devFriendly from '$client/icons/home/devFriendlyIcon.svelte';

	export let data;

	const cards = [
		{
			title: 'Central Management',
			desc: 'Manage virtual stores, create API keys with specific permissions, and handle user authentication through a unified interface.',
			icon: management
		},
		{
			title: 'Advanced Transformations',
			desc: 'Built-in support for image resizing, PDF merging, video encoding, and more - all through a simple API interface.',
			icon: transformations
		},
		{
			title: 'Flexible Storage',
			desc: 'Support for both public and private files with metadata tracking, tagging system, and efficient file organization.',
			icon: storage
		},
		{
			title: 'Self Hosted',
			desc: 'Deploy anywhere using Docker Compose with automatic SSL certificate management via Traefik.',
			icon: hosting
		},
		{
			title: 'Extensible Architecture',
			desc: 'Built for expansion with support for additional apps like backup CLI tools and desktop management interfaces.',
			icon: architecture
		},
		{
			title: 'Developer Friendly',
			desc: 'Complete API documentation, Zod validation, rate limiting, and fine-grained access control through API keys.',
			icon: devFriendly
		}
	];
</script>

<div class="home">
	<div class="gradient-overlay"></div>

	<div class="hero">
		<h1>GStore</h1>
		<p>
			GStore is a robust, self-hosted storage solution designed for institutions, companies, and
			developers. Centralize your file management with advanced features, seamless API integration,
			and unparalleled control.
		</p>
		<a href={data.username ? '/dashboard' : '/auth'}>
			<SyncButton
				text="Get Started"
				icon={RightArrowIcon}
				--padding-block="0.8rem"
				--padding-inline="1.2rem"
			/>
		</a>
	</div>

	<div class="cards">
		{#each cards as { title, desc, icon }, index}
			<div class="card {index % 2 === 0 ? 'left' : 'right'}">
				<div class="card-icon">
					<svelte:component this={icon} />
				</div>
				<h4>{title}</h4>
				<p>{desc}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	/* General Styles */
	.home {
		width: 100vw;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: var(--backgroundColor);
		position: relative;
		gap: 2rem;
		overflow: hidden;
	}

	.gradient-overlay {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 0%, var(--primaryColor) 30%, transparent 70%);
		opacity: 0.1;
		pointer-events: none;
	}

	/* Hero Section */
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 5%;
		max-width: 1000px;
		gap: 1rem;
	}

	.hero h1 {
		color: var(--primaryColor);
	}

	.hero p {
		color: var(--foregroundColor);
		text-align: center;
		opacity: 0.8;
	}

	/* Cards Section */
	.cards {
		width: 100%;
		padding: 5% 10%;
		display: flex;
		flex-direction: column;
		gap: 3rem;
		align-items: center;
		position: relative;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 45%;
		background: var(--backgroundColor);
		padding: 2rem;
		border-radius: var(--border-radius);
		box-shadow: 0 2px 10px var(--primaryColor);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.card-icon {
		width: 40px;
		height: 40px;
		color: var(--primaryColor);
	}

	.card h4 {
		color: var(--primaryColor);
	}

	.card p {
		color: var(--foregroundColor);
		opacity: 0.9;
	}

	.card:hover {
		transform: translateY(-8px);
		box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
	}

	.card.left {
		align-self: flex-start;
	}

	.card.right {
		align-self: flex-end;
	}

	@media screen and (max-width: 768px) {
		.cards {
			padding: 2rem;
		}

		.card {
			width: 90%;
		}

		.card.left,
		.card.right {
			align-self: center;
		}
	}
</style>
