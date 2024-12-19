import { browser } from '$app/environment';
import { loadFromLocalStorage, setLocalStorage } from '$lib/utils/localStorage';
import { getContext, setContext } from 'svelte';
import { DARK_MODE_KEY, LAYOUT_CONTEXT_KEY, THEME_KEY } from './keys';

class LayoutStore {
	darkMode = $state(true);
	drawerOpen = $state(false);
	selectedTheme = $state('');

	constructor() {
		this.darkMode = loadFromLocalStorage(DARK_MODE_KEY, true);

		const themeDefaultValue = browser
			? (document.body.getAttribute('data-theme') ?? 'rastercar')
			: 'rastercar';

		this.selectedTheme = loadFromLocalStorage(THEME_KEY, themeDefaultValue);

		if (browser) {
			this.setThemeOnHtml();
			this.setDarkModeClassesOnHtml();
		}

		$effect(() => {
			setLocalStorage(THEME_KEY, this.selectedTheme);
			setLocalStorage(DARK_MODE_KEY, this.darkMode);

			if (!browser) return;

			this.setThemeOnHtml();
			this.setDarkModeClassesOnHtml();
		});
	}

	private setDarkModeClassesOnHtml() {
		if (this.darkMode) {
			document.documentElement.classList.add('dark');
			document.documentElement.classList.remove('light');
		} else {
			document.documentElement.classList.remove('dark');
			document.documentElement.classList.add('light');
		}
	}

	private setThemeOnHtml() {
		document.body.setAttribute('data-theme', this.selectedTheme);
	}

	changeTheme(theme: string) {
		this.selectedTheme = theme;
	}

	toggleDarkMode() {
		this.drawerOpen = !this.drawerOpen;
	}

	toggleDrawer() {
		this.drawerOpen = !this.drawerOpen;
	}
}

export const setLayoutContext = () => setContext(LAYOUT_CONTEXT_KEY, new LayoutStore());

export const getLayoutContext = () =>
	getContext<ReturnType<typeof setLayoutContext>>(LAYOUT_CONTEXT_KEY);
