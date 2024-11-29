<script lang="ts">
	import SyncButton from '$client/components/button/syncButton.svelte';
	import RightArrowIcon from '$client/icons/rightArrowIcon.svelte';
	import management from "$client/icons/home/managementIcon.svelte"
	import transformations from "$client/icons/home/transformationIcon.svelte"
	import storage from "$client/icons/storageIcon.svelte"
	import hosting from "$client/icons/home/hostingIcon.svelte"
	import architecture from "$client/icons/home/architectureIcon.svelte"
	import devFriendly from "$client/icons/home/devFriendlyIcon.svelte"
	export let data;

	const cards: { title: string; desc: string, icon: typeof management }[] = [
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

	<div class="hero-container">
		<div class="hero">
			<span>GStore</span>
			<h3>Effortless File Management</h3>
			<p>
				GStore is a robust, self-hosted storage solution designed for institutions, companies, and developers.
				Centralize your file management with advanced features, seamless API integration, and unparalleled control.
			</p>
			<div class="cta-section">
				<a href={data.username ? '/dashboard' : '/auth'}>
					<SyncButton
						text="Get Started"
						icon={RightArrowIcon}
						--padding-block="0.8rem"
						--padding-inline="1.2rem"
					/>
				</a>
			</div>
		</div>
	</div>

	<div class="cards">
		{#each cards as card, index}
			<div class="card-container {index % 2 === 0 ? 'left' : 'right'}">
				<div class="card">
					<div class="card-icon">
						<svelte:component this={card.icon} />
					</div>
					<h4 class="card-title">{card.title}</h4>
					<p class="card-desc">{card.desc}</p>
				</div>
			</div>
		{/each}
	</div>	

	<footer class="site-footer">
		<div class="footer-content">
			<div class="footer-section">
				<h3>GStore</h3>
				<p>Simplifying file management for modern organizations.</p>
			</div>
			<div class="footer-section">
				<h4>Quick Links</h4>
				<ul>
					<li><a href="/features">Features</a></li>
					<li><a href="/pricing">Pricing</a></li>
					<li><a href="/docs">Documentation</a></li>
				</ul>
			</div>
			<div class="footer-section">
				<h4>Resources</h4>
				<ul>
					<li><a href="/blog">Blog</a></li>
					<li><a href="/support">Support</a></li>
					<li><a href="/changelog">Changelog</a></li>
				</ul>
			</div>
			<div class="footer-section">
				<h4>Connect</h4>
				<ul class="social-links">
					<li><a href="https://github.com/gstore">GitHub</a></li>
					<li><a href="https://twitter.com/gstore">Twitter</a></li>
					<li><a href="mailto:contact@gstore.com">Contact</a></li>
				</ul>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; {new Date().getFullYear()} GStore. All rights reserved.</p>
		</div>
	</footer>
</div>

<style>
/* General Styles */
.home {
	width: 100vw;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: var(--backgroundColor);
	gap: 4rem;
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

/* Hero Section */
.hero-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	padding: 4rem 5%;
}

.hero {
	max-width: 800px;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
	position: relative;
	z-index: 10;
}

.hero span {
	color: var(--primaryColor);
	font-size: 6rem;
	font-weight: bolder;
	line-height: 1.1;
	margin-bottom: 1rem;
	text-transform: uppercase;
	letter-spacing: -0.05em;
}

.hero h3 {
	color: var(--primaryColor);
	font-size: 3rem;
	font-weight: 800;
	line-height: 1.2;
	margin-bottom: 1rem;
}

.hero p {
	color: var(--foregroundColor);
	max-width: 700px;
	line-height: 1.6;
	opacity: 0.8;
}

.cta-section {
	display: flex;
	gap: 1.5rem;
	align-items: center;
	margin-top: 1.5rem;
}

/* Cards Section */
.cards {
	width: 100%;
	position: relative;
	padding: 5% 10%;
	display: flex;
	flex-direction: column;
	gap: 3rem;
	align-items: center;
}

.card-container {
	width: 100%;
	max-width: 1200px;
	display: flex;
	position: relative;
}

.card-container.left {
	justify-content: flex-start;
}

.card-container.right {
	justify-content: flex-end;
}

.card {
	background: var(--backgroundColor);
	border-radius: var(--border-radius);
	box-shadow: 0 2px 10px var(--primaryColor);
	padding: 2rem 1.5rem;
	width: 45%;
	text-align: left;
	transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.card-icon {
	width: 40px;
	height: 40px;
	color: var(--primaryColor);
	margin-bottom: 1rem;
}

.card:hover {
	transform: translateY(-8px);
	box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.card-title {
	font-size: 1.5rem;
	font-weight: bold;
	margin-bottom: 0.5rem;
	color: var(--primaryColor);
}

.card-desc {
	color: var(--foregroundColor);
	line-height: 1.6;
	opacity: 0.9;
}

.cards::before {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	left: 50%;
	width: 2px;
	background: var(--primaryColor);
	opacity: 0.2;
	z-index: 1;
}

@media screen and (max-width: 768px) {
	.cards {
		width: 100%;
		padding: 5% 10%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
		position: relative;
	}

	.cards::before {
		content: none;
	}

	.card-container {
		justify-content: center;
	}

	.card {
		width: 80%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
}

/* Footer Section */
.site-footer {
	width: 100%;
	background-color: rgba(59, 130, 246, 0.05);
	padding: 4rem 5%;
	border-top: 1px solid rgba(59, 130, 246, 0.1);
}

.footer-content {
	display: grid;
	grid-template-columns: 2fr repeat(3, 1fr);
	gap: 2rem;
	max-width: 1200px;
	margin: 0 auto;
}

.footer-section h3, .footer-section h4 {
	color: var(--primaryColor);
	margin-bottom: 1rem;
}

.footer-section ul {
	list-style: none;
	padding: 0;
}

.footer-section ul li {
	margin-bottom: 0.5rem;
}

.footer-section ul li a, .footer-section p {
	color: var(--foregroundColor);
	text-decoration: none;
	opacity: 0.7;
	transition: opacity 0.3s ease;
}

.footer-section ul li a:hover {
	opacity: 1;
}

.footer-bottom {
	text-align: center;
	margin-top: 2rem;
	padding-top: 2rem;
	border-top: 1px solid rgba(59, 130, 246, 0.1);
	color: var(--mutedColor);
}

/* Responsive Adjustments */
@media screen and (max-width: 768px) {
	.cards {
		grid-template-columns: 1fr;
	}

	.hero h3 {
		font-size: 2.5rem;
	}

	.hero-container {
		padding: 2rem 5%;
	}

	.cta-section {
		flex-direction: column;
		gap: 1rem;
	}

	.footer-content {
		grid-template-columns: 1fr;
	}
}
</style>
