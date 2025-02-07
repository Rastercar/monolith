<script lang="ts">
	import { page } from '$app/state';
	import { MISSING_SESSION, NO_SID_COOKIE } from '$lib/constants/error-codes';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';

	const errorCode = page.error?.code || '';
</script>

{#snippet linkBtn(href: string, icon: string, text: string)}
	<a {href}>
		<button type="button" class="btn preset-filled">
			<span>{text}</span>
			<Icon {icon} />
		</button>
	</a>
{/snippet}

<div class="h-screen flex items-center justify-center flex-col">
	<h1 class="h1">An error has occoured:</h1>

	<h2 class="h2 text-primary-200-800 mb-4">
		{page.error?.message}
	</h2>

	{#if errorCode === MISSING_SESSION}
		{@render linkBtn(route('/auth/sign-out'), 'mdi:sign-out', 'click here to sign out')}
	{:else if errorCode === NO_SID_COOKIE}
		{@render linkBtn(route('/auth/sign-in'), 'mdi:sign-in', 'click here to sign in')}
	{/if}
</div>
