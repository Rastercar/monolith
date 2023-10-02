import { z } from 'zod';

export const passwordValidator = z
	.string()
	.min(5)
	.max(128)
	.regex(/[A-Z]/, 'must contain a uppercase character')
	.regex(/[a-z]/, 'must contain a lowercase character')
	.regex(/[0-9]/, 'must contain a number')
	.regex(/[#?!@$%^&*-]/, 'must contain a especial character (eg: #?!@$%^&*-)');
