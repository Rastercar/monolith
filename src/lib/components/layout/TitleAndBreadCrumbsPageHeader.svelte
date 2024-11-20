<script lang="ts">
	import Breadcrumbs, { type BreadCrumb } from '$lib/components/breadcrumbs/BreadCrumbs.svelte';



	interface Props {
		title: string;
		breadCrumbs: BreadCrumb[];
		margin?: string;
	}

	let { title, breadCrumbs, margin = 'mb-4' }: Props = $props();
</script>

<div class={`flex ${margin} items-center`}>
	<h1 class="h2 mr-auto">{title}</h1>

	<div class="ml-auto">
		<Breadcrumbs {breadCrumbs} />
	</div>
</div>
