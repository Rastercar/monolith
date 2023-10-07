<script lang="ts">
	import type { User } from '$lib/api/auth';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import Icon from '@iconify/svelte';
	import CreatedAtText from './created-at-text.svelte';

	export let user: User;
</script>

<div class="sm:card sm:p-4 sm:rounded-lg">
	<h3 class="mb-2 text-lg flex items-center justify-between">
		<span class="flex items-center">
			<Icon icon="mdi:account" width="32" height="32" class="mr-2" />
			My Account
		</span>

		<CreatedAtText date={user.createdAt} />
	</h3>

	<h1 class="text-2xl mb-1">{user.username}</h1>

	{#if user.description}
		<p class="text-sm mt-2">{user.description}</p>
	{/if}

	<div class="mt-4 flex flex-wrap items-center justify-between">
		<div>
			<span class="opacity-80">email:</span>
			{user.email}
		</div>

		{#if !user.emailVerified}
			<EmailNotConfirmedWarning emailAddress={user.email} />
		{/if}
	</div>
</div>
