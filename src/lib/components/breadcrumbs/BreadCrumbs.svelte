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
		extraClasses?: string;
		breadCrumbs: BreadCrumb[];
	}

	let { breadCrumbs, extraClasses = '' }: Props = $props();
</script>

<ol class={`flex items-center space-x-4 ${extraClasses}`}>
	{#each breadCrumbs as crumb, i}
		<BreadCrumbComponent {...crumb} />

		{#if i !== breadCrumbs.length - 1}
			<BreadCrumbSeparator />
		{/if}
	{/each}
</ol>
