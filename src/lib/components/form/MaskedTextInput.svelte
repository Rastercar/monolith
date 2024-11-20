<script lang="ts" module>
	type Obj = Record<string, unknown>;
	type T = Obj;
</script>

<script lang="ts" generics="T extends Obj">
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import { IMask, imask } from '@imask/svelte';
	import { onDestroy, onMount, tick } from 'svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';

	type MaskOptions = Parameters<typeof IMask>[1];

	export let maskOptions: MaskOptions;

	export let form: SuperForm<T, unknown>;
	export let field: FormPathLeaves<T>;
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
		on:input={onInput}
		on:click
		on:keydown
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
