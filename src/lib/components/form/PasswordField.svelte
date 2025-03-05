<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
	import SnippetOrString from '$lib/components/svelte-specific/SnippetOrString.svelte';
	import Icon from '@iconify/svelte';
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
		inputClass = 'input',
		labelClass = 'label mb-2 text-sm',
		labelExtraClasses = '',
		...fieldAttributes
	}: FieldProps<T, U, HTMLInputAttributes> = $props();

	let inputType: 'password' | 'text' = $state('password');

	const toggleInputType = () => {
		inputType = inputType === 'password' ? 'text' : 'password';
	};

	const { form: formData } = form;
</script>

<FieldWithErrors {form} {name} wrapperClasses={classes}>
	<Control let:attrs>
		<Label class={`${labelClass} ${labelExtraClasses}`}>
			<SnippetOrString children={label} />
		</Label>

		<div class="input-group grid-cols-[1fr_auto]">
			<input
				class={inputClass}
				{...fieldAttributes}
				{...attrs}
				type={inputType}
				bind:value={$formData[name]}
			/>

			<button type="button" class="px-4" onclick={toggleInputType}>
				<Icon icon={inputType === 'password' ? 'mdi:eye' : 'mdi:eye-off'} />
			</button>
		</div>
	</Control>
</FieldWithErrors>
