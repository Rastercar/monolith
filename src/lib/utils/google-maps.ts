/* eslint-disable */

import { env } from '$lib/env/public-env';

/**
 * loads the google maps and marker library
 */
export const loadMapLibraries = async () => {
	const googleMapsAlreadyLoaded = window.google?.maps !== undefined;

	if (!googleMapsAlreadyLoaded) {
		loadGoogleMaps({ key: env.PUBLIC_GOOGLE_MAPS_API_KEY, v: 'weekly' });
		await window.google.maps.importLibrary('maps');
	}

	const markerAlreadyLoaded = window.google?.maps?.marker;
	if (!markerAlreadyLoaded) {
		await window.google.maps.importLibrary('marker');
	}
};

// https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import
const loadGoogleMaps = (g: { key: string; v: string }) => {
	var h,
		a,
		k,
		p = 'The Google Maps JavaScript API',
		c = 'google',
		l = 'importLibrary',
		q = '__ib__',
		m = document,
		b = window;
	b = b[c] || (b[c] = {});
	var d = b.maps || (b.maps = {}),
		r = new Set(),
		e = new URLSearchParams(),
		u = () =>
			h ||
			(h = new Promise(async (f, n) => {
				await (a = m.createElement('script'));
				e.set('libraries', [...r] + '');
				for (k in g)
					e.set(
						k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()),
						g[k]
					);
				e.set('callback', c + '.maps.' + q);
				a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
				d[q] = f;
				a.onerror = () => (h = n(Error(p + ' could not load.')));
				a.nonce = m.querySelector('script[nonce]')?.nonce || '';
				m.head.append(a);
			}));
	d[l]
		? console.warn(p + ' only loads once. Ignoring:', g)
		: (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
};
