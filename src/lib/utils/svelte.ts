import type { Snippet } from 'svelte';

export interface PropsWithChildren<T extends unknown[] = []> {
	children: Snippet<T>;
}

export interface PropsWithClasses {
	classes?: string;
}
