<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	/**@type {Map<number,{ name: string; message: string }>}*/
	const errorMap = new Map([
		[
			400,
			{
				name: 'BAD REQUEST',
				message: 'It seems there is something wrong on your side'
			}
		],
		[
			404,
			{
				name: 'PAGE NOT FOUND',
				message: "The page you looking for either does'not exist or has it name change."
			}
		],
		[
			500,
			{
				name: 'SERVICE UNAVAILABLE',
				message:
					'The service you demanding has encountered some issues recently try access it later.'
			}
		],
		[
			403,
			{
				name: 'FORBIDDEN',
				message: "You should'not be here this area is unaccessable at the moment."
			}
		]
	]);
</script>

<div class="error">
	<h1>Oops !</h1>
	<div>
		{#if errorMap.has($page.status)}
			<h3>{$page.status} - {errorMap.get($page.status).name}</h3>
			<p>{errorMap.get($page.status).message}</p>
		{:else}
			<h3>{$page.status} - unknown</h3>
			<p>Unknown error has occured</p>
		{/if}
	</div>
	<button on:click={() => goto('/')}>GO TO HOMEPAGE</button>
</div>

<style>
	.error {
		--intermediate-color: color-mix(in srgb, var(--backgroundColor) 80%, var(--dangerColor) 20%);
		--mixed: color-mix(in srgb, var(--foregroundColor) 70%, var(--backgroundColor) 30%);
	}
	.error {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		gap: 20px;
		background: linear-gradient(to bottom, var(--backgroundColor), var(--intermediate-color));
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
	.error h1 {
		color: transparent;
		background-color: var(--dangerColor);
		background-clip: text;
		-moz-background-clip: text;
		-webkit-background-clip: text;
	}
	.error div {
		display: flex;
		flex-direction: column;
		width: 90%;
		gap: 10px;
		justify-content: center;
		align-items: center;
	}
	.error div h3 {
		text-align: center;
		color: var(--foregroundColor);
	}
	.error div p {
		text-align: center;
		color: var(--foregroundColor);
	}
	.error button {
		color: var(--backgroundColor);
		font-size: var(--h4);
		font-family: var(--headerFont);
		line-height: var(--lh4);
		font-weight: 600;
		background-color: var(--dangerColor);
		width: fit-content;
		height: fit-content;
		padding-block: 0.5rem;
		padding-inline: 0.5rem;
		border-radius: var(--border-radius);
		outline: none;
		border: none;
		cursor: pointer;
	}
</style>
