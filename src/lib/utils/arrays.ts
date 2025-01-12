export function pickRandomFromArray<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function wrapToArray<T>(v: T | T[]): T[] {
	if (Array.isArray(v)) return v;
	return [v];
}

export function range(n: number) {
	return new Array(n).map((_, i) => i);
}
