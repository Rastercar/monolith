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
		options,
		additionalClasses = '',
		selectedOption = $bindable()
	}: Props = $props();
</script>

{#if options.length}
	<div
		class={`flex sm:flex-row flex-col content-start justify-center ${space} ${additionalClasses}`}
	>
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
