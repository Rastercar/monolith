<script lang="ts">
	import { route } from '$lib/ROUTES';
	import type { Snippet } from 'svelte';

	interface Props {
		href: Parameters<typeof route>[0];
		children: Snippet;
	}

	const { href, children }: Props = $props();
</script>

<a
	class="flex items-center justify-end text-blue-600 dark:text-blue-500 text-sm underline mt-auto"
	href={route(href)}
>
	{@render children()}
</a>
