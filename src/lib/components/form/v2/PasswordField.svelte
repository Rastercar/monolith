<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
	import SnippetOrString from '$lib/components/svelte-specific/SnippetOrString.svelte';
	import Icon from '@iconify/svelte';
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
		labelExtraClasses?: string;
	}

	const {
		form,
		name,
		label,
		inputClass = 'input',
		labelClass = 'label mb-2 text-sm',
		labelExtraClasses = '',
		...fieldAttributes
	}: Props = $props();

	let inputType: 'password' | 'text' = $state('password');

	const toggleInputType = () => {
		inputType = inputType === 'password' ? 'text' : 'password';
	};

	const { form: formData } = form;
</script>

<FieldWithErrors {form} {name}>
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

			<button type="button" class="input-group-cell" onclick={toggleInputType}>
				<Icon icon={inputType === 'password' ? 'mdi:eye' : 'mdi:eye-off'} />
			</button>
		</div>
	</Control>
</FieldWithErrors>
