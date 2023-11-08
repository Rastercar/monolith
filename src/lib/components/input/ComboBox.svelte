<script lang="ts" context="module">
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import type { FormPathType } from 'sveltekit-superforms/dist/stringPath';

	import ErrorMessage from '$lib/components/input/ErrorMessage.svelte';
	import {
		Autocomplete,
		popup,
		type AutocompleteOption,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import type { FormPathLeaves, UnwrapEffects, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { z } from 'zod';

	export let form: SuperForm<ZodValidation<T>, unknown>;

	export let field: FormPathLeaves<z.infer<T>>;
	export let label: string;

	export let options: AutocompleteOption<string>[];

	export let inputClass = 'input mb-1';
	export let labelClass = 'text-sm';

	let clazz = 'label mt-4 mb-1';
	export { clazz as class };

	const { value, errors, constraints } = formFieldProxy(form, field);

	// This field reflects the value store from the formFieldProxy
	// but is guaranteed to be a string, this avoid some type shenanigans
	// with the autocomplete component typing
	let stringValue = typeof value === 'string' ? value : '';

	export let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom-start'
	};

	const onSelection = ({ detail }: CustomEvent<AutocompleteOption<string>>) => {
		stringValue = detail.value;
		value.set(stringValue as FormPathType<z.TypeOf<UnwrapEffects<T>>, FormPathLeaves<z.infer<T>>>);
	};

	$: stringValue = $value as string;
</script>

<label class={clazz}>
	<span class={labelClass}>{label}</span>

	<input
		class={inputClass}
		name={field}
		type="text"
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		use:popup={popupSettings}
		{...$constraints}
		{...$$restProps}
	/>

	<div data-popup="popupAutocomplete" class="card max-w-xs max-h-48 p-0 overflow-y-auto z-10">
		<Autocomplete bind:input={stringValue} {options} on:selection={onSelection} />
	</div>

	<ErrorMessage errors={$errors} />
</label>
