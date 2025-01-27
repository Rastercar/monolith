import { defineWorkspace } from 'vitest/config';

const anyTestGlob = 'src/**/*.test.ts';
const browserTestGlob = 'src/**/*.browser.test.ts';
const integrationTestGlob = 'src/**/*.integration.test.ts';

export default defineWorkspace([
	{
		extends: './vite.config.ts',
		resolve: { conditions: ['svelte'] },
		test: {
			include: [integrationTestGlob],
			exclude: [browserTestGlob],
			name: 'integration',
			environment: 'node',
			setupFiles: ['./src/test/integration-setup.ts'],
			globalSetup: ['./src/test/integration-global-setup.ts']
		}
	},
	{
		extends: './vite.config.ts',
		resolve: { conditions: ['svelte'] },
		test: {
			include: ['src/**/*.test.ts'],
			exclude: [browserTestGlob, integrationTestGlob],
			name: 'unit',
			environment: 'node'
		}
	},
	{
		extends: './vite.config.ts',
		resolve: { conditions: ['svelte', 'browser'] },
		test: {
			include: [browserTestGlob],
			exclude: [integrationTestGlob],
			name: 'unit-browser',
			environment: 'jsdom'
		}
	}
]);
