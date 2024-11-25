<script lang="ts" module>
	type Obj = Record<string, unknown>;
	type T = Obj;
</script>

<script lang="ts" generics="T extends Obj">
	// TODO: REMOVE ME AND ALL v1 fields once references have been dealt with

	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import ErrorMessage from './ErrorMessage.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'form'> {
		form: SuperForm<T, unknown>;
		field: FormPathLeaves<T>;
		label: string;
		className?: string;
		inputClass?: string;
		labelClass?: string;
	}

	let {
		form,
		field,
		label,
		className = 'label mt-4 mb-1',
		inputClass = 'input mb-1',
		labelClass = 'text-sm',
		...rest
	}: Props = $props();

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label class={className}>
	<span class={labelClass}>{label}</span>
	<input
		class={inputClass}
		name={field}
		type="text"
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...rest}
	/>
	<ErrorMessage errors={$errors} />
</label>
