import { flushSync } from 'svelte';
import { describe, expect, test, vi } from 'vitest';
import { DEFAULT_THEME_NAME } from '../../themes/default';
import { DARK_MODE_LS_KEY, THEME_LS_KEY } from './keys';
import { LayoutStore } from './layout.svelte';

describe('LayoutStore', () => {
	test('on no previous settings saved on LocalStorage darkMode is initialized with the value indicated by prefers-color-scheme: dark', () => {
		$effect.root(() => {
			global.window.matchMedia = vi.fn().mockImplementation(() => ({ matches: true }));

			let store = new LayoutStore();
			expect(store.darkMode).toEqual(true);

			global.window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }));

			store = new LayoutStore();
			expect(store.darkMode).toEqual(false);
		});
	});

	test('on previous settings saved on LocalStorage darkMode is initialized with its ls value', () => {
		$effect.root(() => {
			global.window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }));
			localStorage.setItem(DARK_MODE_LS_KEY, 'true');

			let store = new LayoutStore();
			expect(store.darkMode).toEqual(true);
		});
	});

	test('loads the selected theme by the data-theme attribute on document.documentElement, falling back to DEFAULT_THEME_NAME if nil', () => {
		$effect.root(() => {
			let store = new LayoutStore();
			expect(store.selectedTheme).toEqual(DEFAULT_THEME_NAME);

			document.documentElement.setAttribute('data-theme', 'other-theme');
			localStorage.clear();

			store = new LayoutStore();
			expect(store.selectedTheme).toEqual('other-theme');
		});
	});

	test('syncs dark mode and selected theme with the local storage', () => {
		$effect.root(() => {
			let store = new LayoutStore();

			flushSync();

			const parseJsonFromLs = (key: string) => JSON.parse(localStorage.getItem(key) ?? '');

			expect(parseJsonFromLs(THEME_LS_KEY)).toEqual(store.selectedTheme);
			expect(parseJsonFromLs(DARK_MODE_LS_KEY)).toEqual(store.darkMode);

			store.selectedTheme = 'yet-another-theme';

			flushSync();

			expect(parseJsonFromLs(THEME_LS_KEY)).toEqual(store.selectedTheme);
			expect(parseJsonFromLs(DARK_MODE_LS_KEY)).toEqual(store.darkMode);
		});
	});

	test('sets the data-theme attribute on the document documentElement on change', () => {
		$effect.root(() => {
			const themeAttributeBefore = document.documentElement.getAttribute('data-theme');

			let store = new LayoutStore();
			store.selectedTheme = 'another';

			flushSync();

			const themeAttributeAfter = document.documentElement.getAttribute('data-theme');
			expect(themeAttributeAfter).toEqual(store.selectedTheme);

			expect(themeAttributeBefore).not.toEqual(themeAttributeAfter);
		});
	});

	test('sets dark and light classes on the document element accoring to dark mode selection', () => {
		$effect.root(() => {
			let store = new LayoutStore();
			store.darkMode = true;

			flushSync();

			expect(document.documentElement.classList.contains('dark')).toEqual(true);
			expect(document.documentElement.classList.contains('light')).toEqual(false);

			store.darkMode = false;
			flushSync();

			expect(document.documentElement.classList.contains('dark')).toEqual(false);
			expect(document.documentElement.classList.contains('light')).toEqual(true);
		});
	});
});
