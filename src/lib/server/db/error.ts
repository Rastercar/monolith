import postgres from 'postgres';

export function isUniqueConstraintError(error: unknown): error is postgres.PostgresError {
	return error instanceof postgres.PostgresError && error.code === '23505';
}
