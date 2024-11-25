import { getContext, setContext } from 'svelte';
import { LAYOUT_CONTEXT_KEY } from './keys';

class LayoutStore {
	drawerOpen = $state(false);

	toggleDrawer() {
		this.drawerOpen = !this.drawerOpen;
	}
}

export const setLayoutContext = () => setContext(LAYOUT_CONTEXT_KEY, new LayoutStore());

export const getLayoutContext = () =>
	getContext<ReturnType<typeof setLayoutContext>>(LAYOUT_CONTEXT_KEY);
