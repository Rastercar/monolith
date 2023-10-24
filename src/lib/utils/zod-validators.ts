import { z } from 'zod';

const p1 = z.string().min(5).max(128);
const p2 = z.string().regex(/[A-Z]/, 'must contain a uppercase character');
const p3 = z.string().regex(/[a-z]/, 'must contain a lowercase character');
const p4 = z.string().regex(/[0-9]/, 'must contain a number');
const p5 = z.string().regex(/[#?!@$%^&*-]/, 'must contain a especial character (eg: #?!@$%^&*-)');

// https://stackoverflow.com/questions/76047793/is-there-a-way-to-validate-data-between-2-or-more-regex-expressions-using-zod
export const passwordValidator = z.intersection(
	p1,
	z.intersection(z.intersection(p2, p3), z.intersection(p4, p5))
);

export const usernameValidator = z
	.string()
	.min(5)
	.max(32)
	.regex(/^[a-z0-9_]+$/, 'must contain only lowercase letters, numbers and underscores');
