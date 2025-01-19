import { expect, test } from 'vitest';
import { megabytesToBytes } from './number';

test('megabytesToBytes', () => {
	expect(megabytesToBytes(1)).toEqual(1 * 1024 * 1024);
});
