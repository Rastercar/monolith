import { z } from 'zod';

export const updateOrganizationSchema = z.object({
	name: z.string().min(5).max(32).optional(),
	billingEmail: z.string().email().optional()
});

export const organizationSkeletonTheme = z.object({
	/**
	 * @example
	 * ```css
	 * [data-theme='theme'] {
	 * 	--text-scaling: 1.067;
	 * 	--base-font-color: var(--color-surface-950);
	 * 	--base-font-color-dark: var(--color-surface-50);
	 * 	--base-font-family: system-ui, sans-serif;
	 * 	--base-font-size: inherit;
	 * 	--base-line-height: inherit;
	 * 	...
	 * }
	 * ```
	 */
	css: z.string(),
	name: z.string()
});

export const organizationSchema = z.object({
	id: z.number(),
	createdAt: z.date({ coerce: true }),
	name: z.string(),
	billingEmail: z.string(),
	blocked: z.boolean(),
	billingEmailVerified: z.boolean(),
	themesCssVars: z.array(organizationSkeletonTheme).nullish()
});

export type Organization = z.infer<typeof organizationSchema>;

export type UpdateOrganizationBody = z.infer<typeof updateOrganizationSchema>;
