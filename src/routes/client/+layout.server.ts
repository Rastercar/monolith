import { MISSING_SESSION } from '$lib/constants/error-codes';
import type { Theme } from '@skeletonlabs/skeleton/themes';
import * as themes from '@skeletonlabs/skeleton/themes';
import { error } from '@sveltejs/kit';
import { DEFAULT_THEME_NAME } from '../../themes/default';

function createStyleTagWithCssVarsOfThemes(themes: Theme[]) {
	const cssVars = themes
		.map(({ name, properties }) => {
			const cssVars = Object.entries(properties)
				.map(([key, value]) => `  ${key}: ${value};`)
				.join('\n');

			return `:root [data-theme='${name}'] {\n${cssVars}\n}`;
		})
		.join('\n\n');

	return `<style type="text/css">\n${cssVars}\n</style>`;
}

export async function load({ locals }) {
	if (!locals.user) {
		return error(400, { message: 'You must be logged in to see this page', code: MISSING_SESSION });
	}

	// [PROD-TODO] on error we are just ignoring the malformated themes and using the
	// default one, ideally we should notify the user to fix his themes
	//
	// also, review how this feature is done once skeleton with tailwind v4 comes out
	//
	const availableThemes = locals.user.organization.themesCssVars ?? [];

	return {
		user: locals.user,
		availableThemes: [DEFAULT_THEME_NAME, ...Object.values(themes).map((t) => t.name)],
		orgThemeStyleTag: createStyleTagWithCssVarsOfThemes(availableThemes as Theme[])
	};
}
