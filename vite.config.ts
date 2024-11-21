import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { type KIT_ROUTES } from './src/lib/ROUTES';

export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss(),
		kitRoutes<KIT_ROUTES>({
			PAGES: {
				'/auth/sign-in': {
					explicit_search_params: {
						redirect: {
							required: false,
							type: 'string'
						}
					}
				}
			}
		})
	]
});
