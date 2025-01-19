import { expect, test } from 'vitest';
import { castStringToBool, castStringToOptionalBool } from './zod-validators';

const stringToBoolCommonTestCases = [
	['1', true],
	['true', true],
	['TRUE', true],
	['TrUe', true],
	['0', false],
	['false', false],
	['FALSE', false],
	['FaLsE', false]
];

test('castStringToBool - cast string representations of booleans to their boolean counterparts', () => {
	const testCast = (input: unknown, expected: boolean) => {
		expect(castStringToBool.parse(input)).toBe(expected);
	};

	const testCases = [...stringToBoolCommonTestCases];

	testCases.forEach(([input, expected]) => {
		testCast(input, expected as boolean);
	});
});

test('castStringToOptionalBool - cast string representations of booleans to their boolean counterparts, undefined otherwise', () => {
	const testCast = (input: unknown, expected: boolean) => {
		expect(castStringToOptionalBool.parse(input)).toBe(expected);
	};

	const testCases = [
		...stringToBoolCommonTestCases,
		['', undefined],
		[1, undefined],
		[0, undefined]
	];

	testCases.forEach(([input, expected]) => {
		testCast(input, expected as boolean);
	});
});
