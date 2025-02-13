<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T> ">
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
		inputClass = 'checkbox',
		labelClass = 'label ml-2 text-sm',
		labelExtraClasses = '',
		...fieldAttributes
	}: FieldProps<T, U, Omit<HTMLInputAttributes, 'type'>> = $props();

	const { form: formData } = form;
</script>

<FieldWithErrors {form} {name} wrapperClasses={classes}>
	<Control let:attrs>
		<div class="flex items-center">
			<input
				type="checkbox"
				class={inputClass}
				{...fieldAttributes}
				{...attrs}
				bind:checked={$formData[name] as boolean}
			/>

			<Label class={`${labelClass} ${labelExtraClasses}`}>
				<SnippetOrString children={label} />
			</Label>
		</div>
	</Control>
</FieldWithErrors>
