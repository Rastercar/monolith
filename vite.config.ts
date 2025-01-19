import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
import { defineConfig, type ViteDevServer } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { type KIT_ROUTES } from './src/lib/ROUTES';

const socketIo = {
	name: 'socketIo',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		// dont configure the socket io server here as this is done on hooks.server.ts
		globalThis.io = new Server(server.httpServer);
	}
};

export default defineConfig({
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
	plugins: [
		socketIo,
		sveltekit(),
		purgeCss(),
		kitRoutes<KIT_ROUTES>({
			PAGES: {
				'/auth/sign-in': {
					explicit_search_params: {
						redirect: { required: false, type: 'string' }
					}
				},
				'/client/tracking/map': {
					explicit_search_params: {
						lookupTracker: { required: false, type: 'number' }
					}
				}
			}
		})
	]
});
