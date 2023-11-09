<script lang="ts">
	interface Option {
		label: string;
		value: string;
		classes?: string;
	}

	export let space = 'space-x-4';

	export let additionalClasses = '';

	export let options: Option[];

	export let selectedOption: string;

	$: classes = `flex justify-center ${space} ${additionalClasses}`;
</script>

{#if options.length}
	<div class={classes}>
		{#each options as option}
			<button
				class={option.classes}
				class:opacity-50={selectedOption !== option.value}
				on:click={() => (selectedOption = option.value)}
			>
				{option.label}
			</button>
		{/each}
	</div>
{/if}
