<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	export let href: string;
	export let icon: string;
	export let label: string;
</script>

<a {href} class:bg-surface-200-700-token={$page.url.pathname === href} on:click>
	<Icon {icon} class="mr-2" />
	{label}
</a>
