import { browser } from '$app/environment';

export class LocalStore<T> {
	value = $state<T>() as T;
	key = '';

	constructor(key: string, value: T) {
		this.key = key;
		this.value = value;

		if (browser) {
			const item = localStorage.getItem(key);
			if (item) this.value = JSON.stringify(item) as T;
		}

		$effect.root(() => {
			$effect(() => {
				localStorage.setItem(this.key, JSON.parse(this.value as string));
			});
			return () => {};
		});
	}
}

export function localStore<T>(key: string, value: T) {
	return new LocalStore(key, value);
}
