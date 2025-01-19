import { browser } from '$app/environment';

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
	if (!browser) return defaultValue;

	const v = localStorage.getItem(key);
	return v ? JSON.parse(v) : defaultValue;
}

export function setLocalStorage(key: string, value: unknown) {
	if (!browser) return;
	localStorage.setItem(key, JSON.stringify(value));
}
