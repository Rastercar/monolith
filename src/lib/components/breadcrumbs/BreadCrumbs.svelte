<script lang="ts">
	import BreadCrumb from './BreadCrumb.svelte';
	import BreadCrumbSeparator from './BreadCrumbSeparator.svelte';

	interface BreadCrumb {
		href?: string;
		icon?: string;
		text?: string;
	}

	export let additionalClasses = '';

	export let breadCrumbs: BreadCrumb[];
</script>

<ol class={`breadcrumb ${additionalClasses}`}>
	{#each breadCrumbs as crumb, i}
		<BreadCrumb {...crumb} />

		{#if i !== breadCrumbs.length - 1}
			<BreadCrumbSeparator />
		{/if}
	{/each}
</ol>
