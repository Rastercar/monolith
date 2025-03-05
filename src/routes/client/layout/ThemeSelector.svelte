<script lang="ts">
	import { getLayoutContext } from '$lib/store/context';
	import Icon from '@iconify/svelte';

	const { extraClasses = '' }: { extraClasses: string } = $props();

	const layout = getLayoutContext();
</script>

<div
	class={`input-group bg-surface-100-900 divide-surface-200-800 grid-cols-[auto_1fr] divide-x ${extraClasses}`}
>
	<div class="ig-cell">
		<Icon icon="mdi:art" />
	</div>

	<select bind:value={layout.selectedTheme} class="ig-select">
		{#each layout.availableThemes as theme}
			<option value={theme}>{theme}</option>
		{/each}
	</select>
</div>
