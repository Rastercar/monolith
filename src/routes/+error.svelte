<script lang="ts">
	import { page } from '$app/stores';
	import { INVALID_SESSION, NO_SID_COOKIE } from '$lib/constants/error-codes';
	import { route } from '$lib/ROUTES';
	import Icon from '@iconify/svelte';

	const errorCode = $page.error?.code || '';
</script>

<div class="h-screen flex items-center justify-center flex-col">
	<h1 class="h1">An error has occoured:</h1>

	<h2 class="h2 text-primary-200-800 mb-4">
		{$page.error?.message}
	</h2>

	{#if errorCode === INVALID_SESSION}
		<a href={route('/auth/sign-out')}>
			<button type="button" class="btn preset-filled">
				<span>click here to sign out</span>
				<Icon icon="mdi:sign-out" />
			</button>
		</a>
	{:else if errorCode === NO_SID_COOKIE}
		<a href={route('/auth/sign-in')}>
			<button type="button" class="btn preset-filled">
				<span>click here to sign in</span>
				<Icon icon="mdi:sign-in" />
			</button>
		</a>
	{/if}
</div>
