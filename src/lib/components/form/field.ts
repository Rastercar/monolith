import type { FieldProps as FormsnapFieldProps } from 'formsnap';
import type { Snippet } from 'svelte';
import type { FormPath } from 'sveltekit-superforms';

/**
 * Props shared by all form inputs
 */
export interface CommonFieldProps {
	/**
	 * wrap div classes
	 */
	classes?: string;

	/**
	 * label content
	 */
	label: Snippet | string;

	/**
	 * label classes
	 */
	labelClass?: string;

	/**
	 * input field classes
	 */
	inputClass?: string;

	/**
	 * label extra classes, will not ovveride default classes
	 */
	labelExtraClasses?: string;
}

/**
 * - T superform fields
 * - U path to a superform field
 * - Z HtmlAttributes
 */
export type FieldProps<T extends Record<string, unknown>, U extends FormPath<T>, Z> = Omit<
	Z,
	// we dont want to allow overriding the form prop as that is always supposed to be a superform instance
	'form'
> &
	FormsnapFieldProps<T, U> &
	CommonFieldProps;
