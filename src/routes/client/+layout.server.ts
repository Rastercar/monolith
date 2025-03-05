import { MISSING_SESSION } from '$lib/constants/error-codes';
import { error } from '@sveltejs/kit';
import { DEFAULT_THEME_NAME } from '../../themes/default';

function createStyleTagWithCssVarsOfThemes(themesCss: string[]) {
	const allCssString = themesCss.map((t) => t + '\n');
	return `<style type="text/css">\n${allCssString}\n</style>`;
}

export async function load({ locals }) {
	if (!locals.user) {
		return error(400, {
			message: 'Você deve estar logado para ver esta página',
			code: MISSING_SESSION
		});
	}

	const availableThemes = locals.user.organization.themesCssVars ?? [];

	return {
		user: locals.user,
		availableThemes: [DEFAULT_THEME_NAME, availableThemes.map((t) => t.name)],
		orgThemeStyleTag: createStyleTagWithCssVarsOfThemes(availableThemes.map((t) => t.css))
	};
}
