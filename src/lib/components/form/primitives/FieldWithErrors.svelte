<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import { Field, FieldErrors, type FieldProps, type FieldSlotProps } from 'formsnap';
	import type { Snippet } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';

	interface Props extends FieldProps<T, U> {
		children: Snippet<[FieldSlotProps<T, U>]>;
	}

	const { form, name, children }: Props = $props();
</script>

<Field {form} {name} let:value let:errors let:tainted let:constraints>
	{@render children({
		value,
		errors,
		tainted,
		constraints: constraints as Record<string, unknown>
	})}
	<FieldErrors class="text-error-700-300 mt-2" />
</Field>
