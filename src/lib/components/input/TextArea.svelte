<script lang="ts">
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';
	import ErrorMessage from './ErrorMessage.svelte';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let label: string;
	export let withCharacterCounter = true;

	let clazz = 'label mt-4 mb-1';
	export { clazz as class };

	export let inputClass = 'textarea mb-1';
	export let labelClass = 'text-sm';

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label class={clazz}>
	<div class="flex justify-between">
		<span class={labelClass}>{label}</span>

		{#if ($$restProps?.maxlength || 0) > 0 && withCharacterCounter}
			<span class="text-xs text-surface-700-200-token">
				{$value?.length || 0}/{$$restProps?.maxlength}
			</span>
		{/if}
	</div>

	<textarea
		class={inputClass}
		name={field}
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
	/>
	<ErrorMessage errors={$errors} />
</label>
