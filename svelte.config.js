import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	runes: true,

	vitePlugin: {
		inspector: true
	},

	kit: {
		adapter: adapter(),
		env: {
			dir: './env'
		}
	},

	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess()
};

export default config;
