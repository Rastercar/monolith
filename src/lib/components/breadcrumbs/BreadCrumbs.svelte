<script lang="ts" context="module">
	export interface BreadCrumb {
		href?: string;
		icon?: string;
		text?: string;
	}
</script>

<script lang="ts">
	import BreadCrumbComponent from './BreadCrumb.svelte';
	import BreadCrumbSeparator from './BreadCrumbSeparator.svelte';

	export let additionalClasses = '';

	export let breadCrumbs: BreadCrumb[];
</script>

<ol class={`breadcrumb ${additionalClasses}`}>
	{#each breadCrumbs as crumb, i}
		<BreadCrumbComponent {...crumb} />

		{#if i !== breadCrumbs.length - 1}
			<BreadCrumbSeparator />
		{/if}
	{/each}
</ol>
