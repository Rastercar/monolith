<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
	import SnippetOrString from '$lib/components/svelte-specific/SnippetOrString.svelte';
	import { Control, Label } from 'formsnap';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import type { FieldProps } from './field';
	import FieldWithErrors from './primitives/FieldWithErrors.svelte';

	interface Option {
		label: string;
		value: string;
	}

	type Props = FieldProps<T, U, HTMLSelectAttributes> & { options: Option[] };

	const {
		form,
		name,
		label,
		options,
		classes = '',
		inputClass = 'input',
		labelClass = 'label mb-2 text-sm',
		labelExtraClasses = '',
		...fieldAttributes
	}: Props = $props();

	const { form: formData } = form;
</script>

<FieldWithErrors {form} {name} wrapperClasses={classes}>
	<Control let:attrs>
		<Label class={`${labelClass} ${labelExtraClasses}`}>
			<SnippetOrString children={label} />
		</Label>

		<select class={inputClass} bind:value={$formData[name]} {...fieldAttributes} {...attrs}>
			{#each options as option}
				<option value={option.value} selected={$formData[name] === option.value}>
					{option.label}
				</option>
			{/each}
		</select>
	</Control>
</FieldWithErrors>
