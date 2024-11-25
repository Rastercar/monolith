<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
	import SnippetOrString from '$lib/components/svelte-specific/SnippetOrString.svelte';
	import { Control, Label } from 'formsnap';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import type { FieldProps } from './field';
	import FieldWithErrors from './primitives/FieldWithErrors.svelte';

	const {
		form,
		name,
		label,
		classes = '',
		inputClass = 'input',
		labelClass = 'label mb-2 text-sm',
		labelExtraClasses = '',
		...fieldAttributes
	}: FieldProps<T, U, HTMLTextareaAttributes> = $props();

	const { form: formData } = form;
</script>

<FieldWithErrors {form} {name} wrapperClasses={classes}>
	<Control let:attrs>
		<Label class={`${labelClass} ${labelExtraClasses}`}>
			<SnippetOrString children={label} />
		</Label>

		<textarea class={inputClass} {...fieldAttributes} {...attrs} bind:value={$formData[name]}>
		</textarea>
	</Control>
</FieldWithErrors>
