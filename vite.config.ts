import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type UserConfig } from 'vite';
import {
	devOpentelemetryPlugin,
	devServerSocketIoPlugin,
	svelteKitRoutePlugin
} from './dev/vite-plugins';

export const viteConfig: UserConfig = {
	envDir: './env',
	test: {
		coverage: {
			reportsDirectory: './reports/coverage'
		}
	},
	plugins: [
		// initializes otel for dev
		devOpentelemetryPlugin(),

		// attaches SocketIO to the vite dev server
		devServerSocketIoPlugin(),

		// tailwind v4 plugin
		tailwindcss(),

		// bundles sveltekit app
		sveltekit(),

		// creates TS types for sveltekit routes
		svelteKitRoutePlugin(),

		// show the bundlesize of the builded application
		visualizer({ open: true, filename: 'reports/bundle-size-report.html' })
	]
};

export default defineConfig(viteConfig);
