export const megabytesToBytes = (megaBytes: number) => megaBytes * 1024 * 1024;

export function isPositiveInteger(value: unknown): value is number {
	return typeof value === 'number' && Number.isInteger(value) && value > 0;
}
