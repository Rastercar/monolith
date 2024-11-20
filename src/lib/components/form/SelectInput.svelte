<script lang="ts" module>
	type Obj = Record<string, unknown>;
	type T = Obj;
</script>

<script lang="ts" generics="T extends Obj">
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import ErrorMessage from './ErrorMessage.svelte';

	interface Option {
		label: string;
		value: string;
	}

	interface Props {
		form: SuperForm<T, unknown>;
		field: FormPathLeaves<T>;
		options?: Option[];
		label: string;
		class?: string;
		inputClass?: string;
		labelClass?: string;
		[key: string]: any;
	}

	let {
		form,
		field,
		options = [],
		label,
		class: clazz = 'label mt-4 mb-1',
		inputClass = 'input mb-1',
		labelClass = 'text-sm',
		...rest
	}: Props = $props();

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label class={clazz}>
	<span class={labelClass}>{label}</span>
	<select
		class={inputClass}
		name={field}
		bind:value={$value}
		aria-invalid={$errors ? 'true' : undefined}
		{...$constraints}
		{...rest}
	>
		{#each options as option}
			<option value={option.value} selected={$value === option.value}>{option.label}</option>
		{/each}
	</select>
	<ErrorMessage errors={$errors} />
</label>
