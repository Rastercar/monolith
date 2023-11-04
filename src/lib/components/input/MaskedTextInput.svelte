<script lang="ts">
	import ErrorMessage from '$lib/components/input/ErrorMessage.svelte';
	import { IMask, imask } from '@imask/svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';

	type MaskOptions = Parameters<typeof IMask>[1];

	export let maskOptions: MaskOptions;

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let label: string;

	let clazz = 'label mt-4 mb-1';
	export { clazz as class };

	export let inputClass = 'input mb-1';
	export let labelClass = 'text-sm';

	let { value, errors, constraints } = formFieldProxy(form, field);

	let input: HTMLInputElement;

	// TS typings for the IMask value are shit
	// this should be ReturnType<typeof IMask> | undefined
	// but it does not work
	let maskRef: any;

	const setMaskRefValue = (v: string | null) => {
		if (maskRef) maskRef.value = v == null ? '' : v;
	};

	const setValueToMaskRefValue = () => {
		if (maskRef) value.set(maskRef.value);
	};

	onMount(() => {
		maskRef = IMask(input, maskOptions);
		setMaskRefValue($value as string);
	});

	onDestroy(() => {
		if (maskRef) maskRef.destroy();
		maskRef = undefined;
	});

	// Every time the value changes, update the maskRefValue
	$: {
		if (maskRef) {
			if (maskRef.value !== value) setMaskRefValue($value as string);

			// this is not useless, it prevents
			// https://github.com/PaulMaly/svelte-imask/issues/16
			//
			// this happens because maskRef.value set on setMaskRefValue is a
			// setter that validates the value, thus maskRef.value might not
			// be the same as the value in the call above.
			value.set(maskRef.value);
		}
	}
</script>

<label class={clazz}>
	<span class={labelClass}>{label}</span>
	<input
		class={inputClass}
		name={field}
		aria-invalid={$errors ? 'true' : undefined}
		type="text"
		bind:this={input}
		bind:value={$value}
		use:imask={maskRef}
		on:accept={setValueToMaskRefValue}
		on:click
		on:keydown
		on:input
		on:change
		on:focus
		on:blur
		on:invalid
		on:complete
		{...$constraints}
		{...$$restProps}
	/>
	<ErrorMessage errors={$errors} />
</label>
