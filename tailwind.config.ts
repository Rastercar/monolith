import { contentPath, skeleton } from '@skeletonlabs/skeleton/plugin';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import { rastercarTheme } from './src/themes/rastercar';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', contentPath(import.meta.url, 'svelte')],
	theme: { extend: {} },
	plugins: [forms, typography, skeleton({ themes: [rastercarTheme] })]
} satisfies Config;
