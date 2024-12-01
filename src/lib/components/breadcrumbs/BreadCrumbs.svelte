<script lang="ts" module>
	export interface BreadCrumb {
		href?: string;
		icon?: string;
		text?: string;
	}
</script>

<script lang="ts">
	import BreadCrumbComponent from './BreadCrumb.svelte';
	import BreadCrumbSeparator from './BreadCrumbSeparator.svelte';

	interface Props {
		breadCrumbs: BreadCrumb[];
	}

	let { breadCrumbs }: Props = $props();
</script>

<ol class="flex space-x-4">
	{#each breadCrumbs as crumb, i}
		<BreadCrumbComponent {...crumb} />

		{#if i !== breadCrumbs.length - 1}
			<BreadCrumbSeparator />
		{/if}
	{/each}
</ol>
