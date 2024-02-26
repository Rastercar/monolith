<script lang="ts" context="module">
	type Obj = Record<string, unknown>;
	type T = Obj;
</script>

<script lang="ts" generics="T extends Obj">
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import ErrorMessage from './ErrorMessage.svelte';

	export let form: SuperForm<T, unknown>;
	export let field: FormPathLeaves<T>;
	export let label: string;

	let clazz = 'label mt-4 mb-1';
	export { clazz as class };

	export let inputClass = 'input mb-1';
	export let labelClass = 'text-sm';

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label class={clazz}>
	<span class={labelClass}>{label}</span>
	<input
		class={inputClass}
		name={field}
		type="text"
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
	/>
	<ErrorMessage errors={$errors} />
</label>
