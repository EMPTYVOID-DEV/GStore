import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$client: './src/lib/client',
			$server: './src/lib/server',
			$global: './src/lib/global',
			$assets: './src/lib/assets'
		}
	}
};

export default config;
