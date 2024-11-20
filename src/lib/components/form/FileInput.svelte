<script lang="ts" module>
	type Obj = Record<string, unknown>;
	type T = Obj;
</script>

<script lang="ts" generics="T extends Obj">
	import { createEventDispatcher } from 'svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import ErrorMessage from './ErrorMessage.svelte';

	export let form: SuperForm<T, unknown>;

	/**
	 * The form filename input field, this refers to the value of the
	 * `<input type="file" />` which is the filename of the selected file
	 *
	 * @see:
	 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
	 */
	export let field: FormPathLeaves<T>;

	/**
	 * The form file field, this field will be set to the first selected
	 * file of the `<input type="file" />` from this component
	 */
	export let fileField: FormPathLeaves<T>;

	export let label: string;
	export let labelClass = 'text-sm';

	export let inputClass = 'input mb-1';

	let clazz = 'label mt-4 mb-1';
	export { clazz as class };

	const {
		value: filenameValue,
		errors: filenameErrors,
		constraints: filenameConstraints
	} = formFieldProxy(form, field);

	const { errors: fileErrors, value: fileValue } = formFieldProxy(form, fileField);

	const setFile = (v: File) => {
		$fileValue = v as any;
	};

	const dispatch = createEventDispatcher<{ 'file-selected': File }>();
</script>

<label class={clazz}>
	<span class={labelClass}>{label}</span>
	<input
		class={inputClass}
		name={field}
		type="file"
		aria-invalid={[...($filenameErrors || []), ...($fileErrors || [])] ? 'true' : undefined}
		bind:value={$filenameValue}
		on:change={({ currentTarget }) => {
			const file = currentTarget.files?.[0];
			if (!file) return;

			setFile(file);
			dispatch('file-selected', file);
		}}
		{...$filenameConstraints}
		{...$$restProps}
	/>
	<ErrorMessage errors={[...($filenameErrors || []), ...($fileErrors || [])]} />
</label>
