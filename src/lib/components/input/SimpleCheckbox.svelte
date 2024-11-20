<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	interface Props {
		checked: boolean;
		disabled: boolean;
		indeterminate: boolean;
		onChange: ChangeEventHandler<HTMLInputElement>;
	}

	let {
		checked,
		disabled,
		indeterminate = $bindable(),
		onChange
	}: Props = $props();
</script>

<input
	bind:indeterminate
	{disabled}
	{checked}
	class="checkbox disabled:bg-surface-300-600-token disabled:cursor-not-allowed"
	type="checkbox"
	onchange={onChange}
/>
