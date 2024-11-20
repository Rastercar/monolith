<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	interface Props {
		href: string;
		icon: string;
		label: string;
	}

	let { href, icon, label }: Props = $props();
</script>

<a {href} class:bg-surface-200-700-token={$page.url.pathname === href} onclick={bubble('click')}>
	<Icon {icon} class="mr-2" />
	{label}
</a>
