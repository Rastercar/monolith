<script lang="ts">
	import { type Snippet } from 'svelte';
	import SnippetOrString from '../svelte-specific/SnippetOrString.svelte';

	let debounceTimer: ReturnType<typeof setTimeout>;

	interface Props {
		label?: string | Snippet;
		classes: string;
		placeholder?: string;
		debounceMilliseconds?: number;
		onChange: (_: string) => void;
	}

	const { classes, onChange, label, placeholder, debounceMilliseconds = 250 }: Props = $props();

	const debounce = (v: string) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => onChange(v), debounceMilliseconds);
	};
</script>

<label class={classes}>
	{#if label}
		<SnippetOrString children={label} />
	{/if}

	<input
		class={`input ${label && 'mt-2'}`}
		{placeholder}
		type="text"
		onkeyup={(e) => debounce(e.currentTarget.value)}
	/>
</label>
