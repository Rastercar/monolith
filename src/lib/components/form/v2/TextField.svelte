<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
	import SnippetOrString from '$lib/components/svelte-specific/SnippetOrString.svelte';
	import { Control, Label, type FieldProps } from 'formsnap';
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import FieldWithErrors from '../primitives/FieldWithErrors.svelte';

	type _Props = Omit<HTMLInputAttributes, 'form'> & FieldProps<T, U>;

	interface Props extends _Props {
		// trick for linter to detect generics
		_?: FieldProps<T, U>;
		label: Snippet | string;
		labelClass?: string;
		inputClass?: string;
	}

	const {
		form,
		name,
		label,
		inputClass = 'input',
		labelClass = 'label mt-4 mb-1 text-sm',
		...fieldAttributes
	}: Props = $props();

	const { form: formData } = form;
</script>

<FieldWithErrors {form} {name}>
	<Control let:attrs>
		<Label class={labelClass}>
			<SnippetOrString children={label} />
		</Label>

		<input class={inputClass} {...fieldAttributes} {...attrs} bind:value={$formData[name]} />
	</Control>
</FieldWithErrors>
