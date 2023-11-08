<script lang="ts" context="module">
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import Icon from '@iconify/svelte';
	import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { z } from 'zod';
	import ErrorMessage from './ErrorMessage.svelte';

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let label = 'Password';
	export let placeholder = 'Password';

	let inputType: 'password' | 'text' = 'password';

	const toggleInputType = () => {
		inputType = inputType === 'password' ? 'text' : 'password';
	};

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label class="label mt-4 mb-1">
	<span class="text-sm">{label}</span>
	<div class="input-group grid-cols-[1fr_auto]">
		<!-- 
			this seems weird but seems at least it works
			see: https://stackoverflow.com/questions/57392773/error-type-attribute-cannot-be-dynamic-if-input-uses-two-way-binding/57393751#57393751
		 -->
		{#if inputType === 'password'}
			<input
				{placeholder}
				class="input"
				name={field}
				type="password"
				aria-invalid={$errors ? 'true' : undefined}
				bind:value={$value}
				{...$constraints}
				{...$$restProps}
			/>
		{:else}
			<input
				{placeholder}
				class="input"
				name={field}
				type="text"
				aria-invalid={$errors ? 'true' : undefined}
				bind:value={$value}
				{...$constraints}
				{...$$restProps}
			/>
		{/if}
		<button type="button" class="btn p-0" on:click={toggleInputType}>
			<Icon icon={inputType === 'password' ? 'mdi:eye' : 'mdi:eye-off'} width="24" height="24" />
		</button>
	</div>
	<ErrorMessage errors={$errors} />
</label>
