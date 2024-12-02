<script lang="ts">
	import Breadcrumbs, { type BreadCrumb } from '$lib/components/breadcrumbs/BreadCrumbs.svelte';

	interface Props {
		title: string;
		breadCrumbs: BreadCrumb[];
	}

	let { title, breadCrumbs }: Props = $props();
</script>

<div class="flex items-center justify-between">
	<h1 class="h1">{title}</h1>

	<Breadcrumbs {breadCrumbs} extraClasses="hidden sm:flex" />
</div>
