export const emptyStringToNull = (v: string) => (v === '' ? null : v);

export function stringToIntWithFallback(v: string | null, fallback: number) {
	if (!v) return fallback;
	const n = parseInt(v);

	return Number.isNaN(n) ? fallback : n;
}
