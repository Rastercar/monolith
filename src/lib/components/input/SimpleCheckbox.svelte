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
	class="checkbox disabled:bg-surface-300-600-token disabled:cursor-not-allowed"
	type="checkbox"
	on:change={onChange}
/>
