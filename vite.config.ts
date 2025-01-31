import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type UserConfig } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import {
	devOpentelemetryPlugin,
	devServerSocketIoPlugin,
	svelteKitRoutePlugin
} from './dev/vite-plugins';

export const viteConfig: UserConfig = {
	plugins: [
		// initializes otel for dev
		devOpentelemetryPlugin(),

		// attaches SocketIO to the vite dev server
		devServerSocketIoPlugin(),

		// bundles sveltekit app
		sveltekit(),

		// removes duplicated CSS from skeleton and tailwind
		purgeCss(),

		// creates TS types for sveltekit routes
		svelteKitRoutePlugin(),

		// show the bundlesize of the builded application
		visualizer({ open: true })
	]
};

export default defineConfig(viteConfig);
