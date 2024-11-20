<script lang="ts" module>
	type Obj = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Obj">
	import Icon from '@iconify/svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms';
	import ErrorMessage from './ErrorMessage.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'form'> {
		form: SuperForm<T, unknown>;
		field: FormPathLeaves<T>;
		label?: string;
		className?: string;
		placeholder?: string;
	}

	const {
		form,
		field,
		label = 'Password',
		placeholder = 'Password',
		className = 'label mt-4 mb-1'
	}: Props = $props();

	let inputType: 'password' | 'text' = $state('password');

	const toggleInputType = () => {
		inputType = inputType === 'password' ? 'text' : 'password';
	};

	const { value, errors, constraints, ...restProps } = formFieldProxy(form, field);
</script>

<label class={className}>
	<span class="text-sm">{label}</span>
	<div class="input-group grid-cols-[1fr_auto]">
		<input
			{placeholder}
			class="input"
			name={field}
			type={inputType}
			aria-invalid={$errors ? 'true' : undefined}
			bind:value={$value}
			{...$constraints}
			{...restProps}
		/>
		<button type="button" class="input-group-cell" onclick={toggleInputType}>
			<Icon icon={inputType === 'password' ? 'mdi:eye' : 'mdi:eye-off'} />
		</button>
	</div>
	<ErrorMessage errors={$errors} />
</label>
