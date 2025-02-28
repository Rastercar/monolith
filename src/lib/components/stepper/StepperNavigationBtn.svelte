<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		onclick: VoidFunction;
		label?: string;
		disabled?: boolean;
		isStepNextBtn?: boolean;
	}

	let { onclick, disabled = false, label, isStepNextBtn = true }: Props = $props();

	const lbl = $derived(label ? label : isStepNextBtn ? 'Próximo' : 'Anterior');
</script>

<button class="btn preset-filled-primary-500" {disabled} {onclick}>
	{#if isStepNextBtn}
		{#if disabled}
			<Icon icon="mdi:lock" />
		{/if}

		{lbl}
		<Icon icon="mdi:arrow-right" />
	{:else}
		<Icon icon="mdi:arrow-left" />
		{lbl}

		{#if disabled}
			<Icon icon="mdi:lock" />
		{/if}
	{/if}
</button>
