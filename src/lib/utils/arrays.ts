export function pickRandomFromArray<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function wrapToArray<T>(v: T | T[]): T[] {
	if (Array.isArray(v)) return v;
	return [v];
}
