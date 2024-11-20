<script lang="ts" module>
	type Obj = Record<string, unknown>;
	type T = Obj;
</script>

<script lang="ts" generics="T extends Obj">
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import ErrorMessage from './ErrorMessage.svelte';


	

	interface Props {
		form: SuperForm<T, unknown>;
		field: FormPathLeaves<T>;
		label: string;
		class?: string;
		inputClass?: string;
		labelClass?: string;
		[key: string]: any
	}

	let {
		form,
		field,
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
	<input
		class={inputClass}
		name={field}
		type="number"
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...rest}
	/>
	<ErrorMessage errors={$errors} />
</label>
