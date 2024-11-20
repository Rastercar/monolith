import { browser } from '$app/environment';

export function useLocalStorage<T>(key: string, initialValue: T) {
	const storage = $state<{ value: T }>({ value: initialValue });

	if (browser) {
		const value = localStorage.getItem(key);
		if (value) storage.value = JSON.parse(value) as T;
	}

	$effect.root(() => {
		$effect(() => {
			localStorage.setItem(key, JSON.stringify(storage.value));
		});
		return () => {};
	});

	return storage;
}
