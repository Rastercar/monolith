import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { DARK_MODE_KEY, LAYOUT_CONTEXT_KEY, THEME_KEY } from './keys';

function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
	if (browser) {
		const v = localStorage.getItem(key);
		return v ? JSON.parse(v) : defaultValue;
	}

	return defaultValue;
}

const setLocalStorage = (key: string, value: unknown) => {
	localStorage.setItem(key, JSON.stringify(value));
};

class LayoutStore {
	darkMode = $state(true);
	drawerOpen = $state(false);
	selectedTheme = $state('');

	constructor() {
		this.darkMode = loadFromLocalStorage(THEME_KEY, false);

		const themeDefaultValue = browser
			? (document.body.getAttribute('data-theme') ?? 'rastercar')
			: 'rastercar';

		this.selectedTheme = loadFromLocalStorage(THEME_KEY, themeDefaultValue);

		if (browser) document.body.setAttribute('data-theme', this.selectedTheme);

		$effect(() => {
			setLocalStorage(THEME_KEY, this.selectedTheme);
			setLocalStorage(DARK_MODE_KEY, this.darkMode);

			if (!browser) return;
			document.body.setAttribute('data-theme', this.selectedTheme);

			if (this.darkMode) {
				document.documentElement.classList.add('dark');
				document.documentElement.classList.remove('light');
			} else {
				document.documentElement.classList.remove('dark');
				document.documentElement.classList.add('light');
			}
		});
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
