<script lang="ts">
	import Breadcrumbs, { type BreadCrumb } from '$lib/components/breadcrumbs/BreadCrumbs.svelte';

	interface Props {
		title: string;
		breadCrumbs: BreadCrumb[];
		margin?: string;
	}

	let { title, breadCrumbs, margin = 'mb-4' }: Props = $props();
</script>

<div class={`flex ${margin} items-center justify-between`}>
	<h1 class="h1">{title}</h1>

	<Breadcrumbs {breadCrumbs} />
</div>
