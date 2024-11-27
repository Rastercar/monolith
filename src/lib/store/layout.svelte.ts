import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { LAYOUT_CONTEXT_KEY, THEME_KEY } from './keys';

const loadFromLocalStorage = (key: string, defaultValue?: string) => {
	const v = localStorage.getItem(key);
	return v ? JSON.parse(v) : defaultValue;
};

class LayoutStore {
	drawerOpen = $state(false);
	selectedTheme = $state('');

	constructor() {
		if (browser) this.selectedTheme = loadFromLocalStorage(THEME_KEY);

		$effect(() => {
			localStorage.setItem(THEME_KEY, JSON.stringify(this.selectedTheme));
		});
	}

	toggleDrawer() {
		this.drawerOpen = !this.drawerOpen;
	}
}

export const setLayoutContext = () => setContext(LAYOUT_CONTEXT_KEY, new LayoutStore());

export const getLayoutContext = () =>
	getContext<ReturnType<typeof setLayoutContext>>(LAYOUT_CONTEXT_KEY);
