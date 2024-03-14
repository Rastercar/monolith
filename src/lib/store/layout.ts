import { writable } from 'svelte/store';

interface LayoutState {
	showHeader: boolean;
}

export const layoutStore = writable<LayoutState>({ showHeader: true });
