<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
	import SnippetOrString from '$lib/components/svelte-specific/SnippetOrString.svelte';
	import { imask, IMask } from '@imask/svelte';
	import { Control, Label } from 'formsnap';
	import { onDestroy, onMount, tick } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import type { FieldProps } from './field';
	import FieldWithErrors from './primitives/FieldWithErrors.svelte';

	type MaskOptions = Parameters<typeof IMask>[1];

	type Props = FieldProps<T, U, HTMLInputAttributes> & {
		maskOptions: MaskOptions;
	};

	const {
		form,
		name,
		label,
		classes = '',
		maskOptions,
		inputClass = 'input',
		labelClass = 'label mb-2 text-sm',
		labelExtraClasses = '',
		...fieldAttributes
	}: Props = $props();

	const { form: formData } = form;

	let input = $state<HTMLInputElement>();

	// TS typings for the IMask value are shit
	// this should be ReturnType<typeof IMask> | undefined
	let maskRef: any = $state();

	const setMaskRefValue = (v: string | null) => {
		if (maskRef) maskRef.value = v === null ? '' : v;
	};

	const onInput = () => {
		if (maskRef) $formData[name] = maskRef.value;
	};

	$effect(() => {
		setMaskRefValue($formData[name] as string);
	});

	onMount(() => {
		if (!input) return;

		maskRef = IMask(input, maskOptions);

		// wait for the tick to register the input value then update the Imask value to match the field
		tick().then(() => setMaskRefValue($formData[name] as string));
	});

	onDestroy(() => {
		if (maskRef) maskRef.destroy();
		maskRef = undefined;
	});
</script>

<FieldWithErrors {form} {name} wrapperClasses={classes}>
	<Control let:attrs>
		<Label class={`${labelClass} ${labelExtraClasses}`}>
			<SnippetOrString children={label} />
		</Label>

		<input
			bind:this={input}
			bind:value={$formData[name]}
			use:imask={maskRef}
			oninput={onInput}
			class={inputClass}
			{...fieldAttributes}
			{...attrs}
		/>
	</Control>
</FieldWithErrors>
