<script lang="ts" module>
	type Obj = Record<string, unknown>;
	type T = Obj;
</script>

<script lang="ts" generics="T extends Obj">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import { IMask, imask } from '@imask/svelte';
	import { onDestroy, onMount, tick } from 'svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';

	type MaskOptions = Parameters<typeof IMask>[1];



	

	interface Props {
		maskOptions: MaskOptions;
		form: SuperForm<T, unknown>;
		field: FormPathLeaves<T>;
		label: string;
		class?: string;
		inputClass?: string;
		labelClass?: string;
		[key: string]: any
	}

	let {
		maskOptions,
		form,
		field,
		label,
		class: clazz = 'label mt-4 mb-1',
		inputClass = 'input mb-1',
		labelClass = 'text-sm',
		...rest
	}: Props = $props();

	let { value, errors, constraints } = formFieldProxy(form, field);

	let input: HTMLInputElement = $state();

	// TS typings for the IMask value are shit
	// this should be ReturnType<typeof IMask> | undefined
	// but it does not work
	let maskRef: any = $state();

	const setMaskRefValue = (v: string | null) => {
		if (maskRef) maskRef.value = v === null ? '' : v;
	};

	const onInput = () => {
		setTimeout(() => {
			if (maskRef) value.set(maskRef.value);
		});
	};

	onMount(() => {
		maskRef = IMask(input, maskOptions);

		// wait for the tick to register the input value then update the Imask value to match the field
		tick().then(() => setMaskRefValue($value as string));
	});

	onDestroy(() => {
		if (maskRef) maskRef.destroy();
		maskRef = undefined;
	});
</script>

<label class={clazz}>
	<span class={labelClass}>{label}</span>
	<input
		class={inputClass}
		name={field}
		aria-invalid={$errors ? 'true' : undefined}
		type="text"
		value={$value}
		bind:this={input}
		use:imask={maskRef}
		oninput={onInput}
		onclick={bubble('click')}
		onkeydown={bubble('keydown')}
		onchange={bubble('change')}
		onfocus={bubble('focus')}
		onblur={bubble('blur')}
		oninvalid={bubble('invalid')}
		oncomplete={bubble('complete')}
		{...$constraints}
		{...rest}
	/>
	<ErrorMessage errors={$errors} />
</label>
