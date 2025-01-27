import postgres from 'postgres';
import { expect, test } from 'vitest';
import { isErrorFromUniqueConstraint, isUniqueConstraintError } from './error';

test('isErrorFromUniqueConstraint - returns true if its a postgres error with code 23505 and the violated constraint matches', () => {
	const uniqueError = new postgres.PostgresError('');
	uniqueError.code = '23505';
	uniqueError.constraint_name = 'id_unique';

	expect(isErrorFromUniqueConstraint(uniqueError, 'some-key')).toBe(false);
	expect(isErrorFromUniqueConstraint(uniqueError, uniqueError.constraint_name)).toBe(true);
});

test('isUniqueConstraintError - returns true if its a postgres error with code 23505', () => {
	expect(isUniqueConstraintError('')).toBe(false);
	expect(isUniqueConstraintError(1)).toBe(false);
	expect(isUniqueConstraintError(new Date())).toBe(false);
	expect(isUniqueConstraintError(new Error())).toBe(false);
	expect(isUniqueConstraintError(new Error('23505'))).toBe(false);
	expect(isUniqueConstraintError({ code: '23505' })).toBe(false);
	expect(isUniqueConstraintError(new postgres.PostgresError(''))).toBe(false);

	const uniqueError = new postgres.PostgresError('');
	uniqueError.code = '23505';

	expect(isUniqueConstraintError(uniqueError)).toBe(true);
});
