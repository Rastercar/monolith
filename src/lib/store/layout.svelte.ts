import { browser } from '$app/environment';
import { loadFromLocalStorage, setLocalStorage } from '$lib/utils/local-storage';
import { DEFAULT_THEME_NAME } from '../../themes/default';
import { DARK_MODE_LS_KEY, THEME_LS_KEY } from './keys';

export class LayoutStore {
	darkMode = $state(true);

	drawerOpen = $state(false);

	selectedTheme = $state('');

	availableThemes = $state([DEFAULT_THEME_NAME]);

	constructor() {
		this.darkMode = loadFromLocalStorage(DARK_MODE_LS_KEY, true);

		const themeDefaultValue = browser
			? (document.body.getAttribute('data-theme') ?? DEFAULT_THEME_NAME)
			: DEFAULT_THEME_NAME;

		this.selectedTheme = loadFromLocalStorage(THEME_LS_KEY, themeDefaultValue);

		if (browser) {
			this.setThemeOnHtml();
			this.setDarkModeClassesOnHtml();
		}

		$effect(() => {
			setLocalStorage(THEME_LS_KEY, this.selectedTheme);
			setLocalStorage(DARK_MODE_LS_KEY, this.darkMode);

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
