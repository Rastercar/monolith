import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
import { defineConfig, type ViteDevServer } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { type KIT_ROUTES } from './src/lib/ROUTES';
import { configureSocketIoServer } from './src/lib/server/socketio';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		configureSocketIoServer(io);
	}
};

export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss(),
		kitRoutes<KIT_ROUTES>({
			PAGES: {
				'/auth/sign-in': {
					explicit_search_params: {
						redirect: { required: false, type: 'string' }
					}
				}
			}
		}),
		webSocketServer
	]
});
