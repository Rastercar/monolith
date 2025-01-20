import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
import { defineConfig, type UserConfig, type ViteDevServer } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { type KIT_ROUTES } from './src/lib/ROUTES';

/**
 * Creates a SocketIO server instance attached to the
 * vite development server, this way we can have websockets
 * when running on development mode !
 *
 * this wont run when building to production and therefore
 * we need to create a SocketIO instance in some other way
 * in that case (see server/index.js)
 */
const viteDevServerSocketIoPlugin = {
	name: 'socketIo',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		// dont configure the socket io server here as this is done on hooks.server.ts
		globalThis.io = new Server(server.httpServer);
	}
};

export const viteConfig: UserConfig = {
	plugins: [
		viteDevServerSocketIoPlugin,
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
};

export default defineConfig(viteConfig);
