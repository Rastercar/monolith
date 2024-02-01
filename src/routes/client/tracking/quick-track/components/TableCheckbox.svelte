<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	export let checked: boolean;
	export let disabled: boolean;
	export let indeterminate: boolean;
	export let onChange: ChangeEventHandler<HTMLInputElement>;
</script>

<input
	bind:indeterminate
	{disabled}
	{checked}
	class="checkbox"
	type="checkbox"
	on:change={onChange}
/>
