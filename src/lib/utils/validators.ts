type validationResult = string | string[] | null | undefined;

type validatorFn = (v: string) => validationResult;

/**
 * Aggregates multiple validators into a single validator function,
 * returning the first error if any.
 *
 * @example
 * ```ts
 * const required = (v: string) => (!!v ? null : 'password is required');
 * const notSilly = (v: string) => (v !== '123' ? null : 'bad password');
 *
 * const validatePassword = validatorChain([required, notSilly])
 *
 * validatePassword('')    // password is required
 * validatePassword('123') // bad password
 * ```
 */
export const validatorChain = (validators: validatorFn[]): validatorFn => {
	const aggregator = (v: string): validationResult => {
		for (let index = 0; index < validators.length; index++) {
			const validationResult = validators[index](v);

			// early abort on error
			if (validationResult !== null && validationResult !== undefined) {
				return validationResult;
			}
		}

		return null;
	};

	return aggregator;
};

export const isEmail = (v: string): boolean => {
	// eslint-disable-next-line no-control-regex
	return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(
		v
	);
};

export const isRequired = (v: string): boolean => !!v;
