<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
	import SnippetOrString from '$lib/components/svelte-specific/SnippetOrString.svelte';
	import { Control, Label } from 'formsnap';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import type { FieldProps } from './field';
	import FieldWithErrors from './primitives/FieldWithErrors.svelte';

	const {
		form,
		name,
		label,
		classes = '',
		inputClass = 'input type-scale-1',
		labelClass = 'label mb-2 text-sm',
		labelExtraClasses = '',
		...fieldAttributes
	}: FieldProps<T, U, HTMLInputAttributes> = $props();

	const { form: formData } = form;
</script>

<FieldWithErrors {form} {name} wrapperClasses={classes}>
	<Control let:attrs>
		<Label class={`${labelClass} ${labelExtraClasses}`}>
			<SnippetOrString children={label} />
		</Label>

		<input
			type="file"
			class={inputClass}
			{...fieldAttributes}
			{...attrs}
			oninput={(e) => ($formData[name] = e.currentTarget.files?.item(0) as File as any)}
		/>
	</Control>
</FieldWithErrors>
