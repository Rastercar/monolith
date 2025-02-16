<script lang="ts">
	import { useDebounce } from 'runed';
	import { type Snippet } from 'svelte';
	import SnippetOrString from '../svelte-specific/SnippetOrString.svelte';

	interface Props {
		label?: string | Snippet;
		classes?: string;
		placeholder?: string;
		debounceMilliseconds?: number;
		onChange: (_: string) => void;
	}

	const { classes, onChange, label, placeholder, debounceMilliseconds = 250 }: Props = $props();

	const onChangeDebounced = useDebounce(onChange, debounceMilliseconds);
</script>

<label class={classes}>
	{#if label}
		<SnippetOrString children={label} />
	{/if}

	<input
		class={`input ${label && 'mt-2'}`}
		{placeholder}
		type="text"
		onkeyup={(e) => onChangeDebounced(e.currentTarget.value)}
	/>
</label>
