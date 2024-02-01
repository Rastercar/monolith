<script lang="ts" context="module">
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { z } from 'zod';
	import ErrorMessage from './ErrorMessage.svelte';

	interface Option {
		label: string;
		value: string;
	}

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;

	export let options: Option[] = [];
	export let label: string;

	let clazz = 'label mt-4 mb-1';
	export { clazz as class };

	export let inputClass = 'input mb-1';
	export let labelClass = 'text-sm';

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
		{...$$restProps}
	>
		{#each options as option}
			<option value={option.value} selected={$value === option.value}>{option.label}</option>
		{/each}
	</select>
	<ErrorMessage errors={$errors} />
</label>
