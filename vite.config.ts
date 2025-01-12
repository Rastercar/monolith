import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
import { defineConfig, type ViteDevServer } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { type KIT_ROUTES } from './src/lib/ROUTES';
import { configureSocketIoServer, setSocketIoInstance } from './src/lib/server/socketio';

const socketIo = {
	name: 'socketIo',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		configureSocketIoServer(io);
		setSocketIoInstance(io);
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
				}
			}
		})
	]
});
