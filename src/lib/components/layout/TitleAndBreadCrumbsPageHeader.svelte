<script lang="ts">
	import Breadcrumbs, { type BreadCrumb } from '$lib/components/breadcrumbs/BreadCrumbs.svelte';

	export let title: string;

	export let breadCrumbs: BreadCrumb[];

	export let margin = 'mb-4';
</script>

<div class={`flex ${margin} items-center`}>
	<h1 class="h2 mr-auto">{title}</h1>

	<div class="ml-auto">
		<Breadcrumbs {breadCrumbs} />
	</div>
</div>
