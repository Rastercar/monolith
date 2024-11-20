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
		withCharacterCounter?: boolean;
		class?: string;
		inputClass?: string;
		labelClass?: string;
		[key: string]: any;
	}

	let {
		form,
		field,
		label,
		withCharacterCounter = true,
		class: clazz = 'label mt-4 mb-1',
		inputClass = 'textarea mb-1',
		labelClass = 'text-sm',
		...rest
	}: Props = $props();

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label class={clazz}>
	<div class="flex justify-between">
		<span class={labelClass}>{label}</span>

		{#if (rest?.maxlength || 0) > 0 && withCharacterCounter}
			<span class="text-xs text-surface-700-200-token">
				{$value?.length || 0}/{rest?.maxlength}
			</span>
		{/if}
	</div>

	<textarea
		class={inputClass}
		name={field}
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...rest}
	></textarea>
	<ErrorMessage errors={$errors} />
</label>
