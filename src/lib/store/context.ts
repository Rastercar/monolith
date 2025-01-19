import { getContext, setContext } from 'svelte';
import { AuthStore } from './auth.svelte';
import { AUTH_CTX_KEY, LAYOUT_CTX_KEY, MAP_CTX_KEY } from './keys';
import { LayoutStore } from './layout.svelte';
import { MapPageStore } from './map.svelte';

// we keep context setters and getters on this file so we can test the stores
// (importing getContext relies on browser things that are not available on
// the test enviroment)

export const setAuthContext = () => setContext(AUTH_CTX_KEY, new AuthStore());

export const getAuthContext = () => getContext<ReturnType<typeof setAuthContext>>(AUTH_CTX_KEY);

export const setLayoutContext = () => setContext(LAYOUT_CTX_KEY, new LayoutStore());

export const getLayoutContext = () =>
	getContext<ReturnType<typeof setLayoutContext>>(LAYOUT_CTX_KEY);

export const getMapContext = () => getContext<ReturnType<typeof setMapContext>>(MAP_CTX_KEY);

export const setMapContext = () => setContext(MAP_CTX_KEY, new MapPageStore());
