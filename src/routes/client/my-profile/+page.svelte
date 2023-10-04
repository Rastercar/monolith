<script>
	import EmailNotConfirmedButton from '$lib/components/button/EmailNotConfirmedButton.svelte';
	import { authStore } from '$lib/store/auth';
	import Icon from '@iconify/svelte';
</script>

{#if $authStore.user}
	<div class="p-6 max-w-4xl mx-auto">
		<div class="card p-4 rounded-lg">
			<h3 class="mb-2 text-lg flex items-center justify-between">
				<span class="flex items-center">
					<Icon icon="mdi:account" width="32" height="32" class="mr-2" />
					My Account
				</span>

				<div class="text-sm">
					<span class="opacity-80 mt-2">created at:</span>
					{new Date($authStore.user.createdAt).toLocaleDateString()}
				</div>
			</h3>

			<h1 class="text-2xl mb-1">{$authStore.user.username}</h1>

			{#if $authStore.user.description}
				<p>{$authStore.user.description}</p>
			{/if}

			<div class="mt-4 flex items-center">
				<span class="opacity-80 mr-2">email:</span>
				{$authStore.user.email}
			</div>

			{#if $authStore.user.emailVerified}
				<div class="mt-2">
					<EmailNotConfirmedButton emailAddress={$authStore.user.email} />
				</div>
			{/if}
		</div>

		<div class="card p-4 rounded-lg my-6">
			<h3 class="mb-2 text-lg flex items-center justify-between">
				<span class="flex items-center">
					<Icon icon="mdi:company" width="32" height="32" class="mr-2" />
					My Organization
				</span>

				<div class="text-sm">
					<span class="opacity-80 mt-2">created at:</span>
					{new Date($authStore.user.organization.createdAt).toLocaleDateString()}
				</div>
			</h3>

			<h1 class="text-2xl mb-1">{$authStore.user.organization.name}</h1>

			<div class="mt-4 flex items-center">
				<span class="opacity-80 mr-2">billing email:</span>
				{$authStore.user.organization.billingEmail}
			</div>

			{#if $authStore.user.organization.billingEmailVerified}
				<div class="mt-2">
					<EmailNotConfirmedButton emailAddress={$authStore.user.organization.billingEmail} />
				</div>
			{/if}
		</div>

		<div class="card p-4 rounded-lg">
			<h3 class="mb-2 text-lg flex items-center">
				<Icon icon="mdi:lock" width="32" height="32" class="mr-2" />
				Role and Permissions
			</h3>

			<h4>
				<span class="opacity-80 mt-2">Access Level:</span>
				{$authStore.user.accessLevel.name}
			</h4>

			<h4 class="opacity-90 text-sm line-clamp-4 mb-2">
				{$authStore.user.accessLevel.description}
			</h4>

			<!-- TODO: decide on permissions enum so we can have a value -> description map -->
			<div class="opacity-80">permissions:</div>
			{#each $authStore.user.accessLevel.permissions as permission}
				<h4 class="opacity-90 text-sm line-clamp-4 mt-1">
					{permission}
				</h4>
			{/each}
		</div>
	</div>
{/if}
