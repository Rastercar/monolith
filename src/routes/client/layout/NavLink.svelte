<script lang="ts">
	import { page } from '$app/stores';
	import { type KIT_ROUTES } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';

	interface Props {
		href: keyof KIT_ROUTES['PAGES'];
		icon: string;
		label: string;
	}

	let { href, icon, label }: Props = $props();
</script>

<a
	{href}
	class="flex items-center text-lg px-5 py-2"
	class:bg-surface-200-700-token={$page.url.pathname === href}
>
	<Icon {icon} class="mr-2" />
	{label}
</a>
