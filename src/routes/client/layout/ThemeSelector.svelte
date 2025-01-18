<script lang="ts">
	import { getLayoutContext } from '$lib/store/layout.svelte';
	import Icon from '@iconify/svelte';

	const { extraClasses = '' }: { extraClasses: string } = $props();

	const layout = getLayoutContext();
</script>

<div
	class={`input-group bg-surface-100-900 divide-surface-200-800 grid-cols-[auto_1fr] divide-x ${extraClasses}`}
>
	<div class="input-group-cell">
		<Icon icon="mdi:art" />
	</div>

	<select bind:value={layout.selectedTheme}>
		{#each layout.availableThemes as theme}
			<option value={theme}>{theme}</option>
		{/each}
	</select>
</div>
