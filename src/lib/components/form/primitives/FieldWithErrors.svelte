<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import { Field, FieldErrors, type FieldProps, type FieldSlotProps } from 'formsnap';
	import type { Snippet } from 'svelte';
	import type { FormPath } from 'sveltekit-superforms';

	interface Props extends FieldProps<T, U> {
		wrapperClasses?: string;
		children: Snippet<[FieldSlotProps<T, U>]>;
	}

	const { form, name, wrapperClasses, children }: Props = $props();
</script>

<Field {form} {name} let:value let:errors let:tainted let:constraints>
	<!-- 
		this wrapper div facilitates treating errors and the children content (normally a label and a input) 
		as a single block, so it can be easily used in layouts
	-->
	<div class={wrapperClasses}>
		{@render children({
			value,
			errors,
			tainted,
			constraints: constraints as Record<string, unknown>
		})}
		<FieldErrors class="text-error-700-300 mt-2" />
	</div>
</Field>
