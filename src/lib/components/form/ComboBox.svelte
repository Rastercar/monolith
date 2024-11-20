<script lang="ts" module>
	type Obj = Record<string, unknown>;
	type T = Obj;
</script>

<script lang="ts" generics="T extends Obj">
	import { run } from 'svelte/legacy';

	import type { FormPathType } from 'sveltekit-superforms';

	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import {
		Autocomplete,
		popup,
		type AutocompleteOption,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';





	

	const { value, errors, constraints } = formFieldProxy(form, field);

	// This field reflects the value store from the formFieldProxy
	// but is guaranteed to be a string, this avoid some type shenanigans
	// with the autocomplete component typing
	let stringValue = $state(typeof value === 'string' ? value : '');

	interface Props {
		form: SuperForm<T, unknown>;
		field: FormPathLeaves<T>;
		label: string;
		options: AutocompleteOption<string>[];
		inputClass?: string;
		labelClass?: string;
		class?: string;
		popupSettings?: PopupSettings;
		[key: string]: any
	}

	let {
		form,
		field,
		label,
		options,
		inputClass = 'input mb-1',
		labelClass = 'text-sm',
		class: clazz = 'label mt-4 mb-1',
		popupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom-start'
	},
		...rest
	}: Props = $props();

	const onSelection = ({ detail }: CustomEvent<AutocompleteOption<string>>) => {
		stringValue = detail.value;
		value.set(stringValue as FormPathType<T, FormPathLeaves<T>>);
	};

	run(() => {
		stringValue = $value as string;
	});
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
		{...rest}
	/>

	<div data-popup="popupAutocomplete" class="card max-w-xs max-h-48 p-0 overflow-y-auto z-10">
		<Autocomplete bind:input={stringValue} {options} on:selection={onSelection} />
	</div>

	<ErrorMessage errors={$errors} />
</label>
