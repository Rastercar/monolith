<script lang="ts">
	interface Option {
		label: string;
		value: string;
		classes?: string;
	}




	interface Props {
		space?: string;
		additionalClasses?: string;
		options: Option[];
		selectedOption: string;
	}

	let {
		space = 'gap-4',
		additionalClasses = '',
		options,
		selectedOption = $bindable()
	}: Props = $props();

	let classes = $derived(`flex sm:flex-row flex-col content-start justify-center ${space} ${additionalClasses}`);
</script>

{#if options.length}
	<div class={classes}>
		{#each options as option}
			<button
				class={option.classes}
				class:opacity-50={selectedOption !== option.value}
				onclick={() => (selectedOption = option.value)}
			>
				{option.label}
			</button>
		{/each}
	</div>
{/if}
