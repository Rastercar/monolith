<script lang="ts">
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject, z } from 'zod';
	import ErrorMessage from './ErrorMessage.svelte';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let label: string;

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label class="label mt-4 mb-1">
	<span class="text-sm">{label}</span>
	<textarea
		class="textarea mb-1"
		name={field}
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
	/>
</label>
<ErrorMessage errors={$errors} />
