<script lang="ts">
	import SessionCard from './components/SessionCard.svelte';

	// TODO: mocks
	const sessionMocks = [
		{
			isOnMobileDevice: true,
			ip: '177.79.21.221',
			location: 'Campo Grande',
			createdAt: 'Oct 08, 2023',
			expiresAt: '3 days',
			isCurrent: false
		},
		{
			isOnMobileDevice: false,
			ip: '177.79.21.221',
			location: 'Campo Grande',
			createdAt: 'Oct 08, 2023',
			expiresAt: '3 days',
			isCurrent: true
		},
		{
			isOnMobileDevice: false,
			ip: '177.79.21.221',
			location: 'Campo Grande',
			createdAt: 'Oct 08, 2023',
			expiresAt: '3 days',
			isCurrent: false
		}
	];
</script>

<!-- TODO: finish me ! (test mobile version) -->
<div class="p-6 max-w-4xl mx-auto space-y-6">
	<h1 class="text-2xl">Your web sessions</h1>
	<h2 class="!mt-3 text-surface-700-200-token text-sm">
		This is a list of devices that have logged into your account. Revoke any sessions that you do
		not recognize.
	</h2>

	<div class="sm:card sm:rounded-lg">
		{#each sessionMocks as session, i}
			<SessionCard {session} />

			{#if i < sessionMocks.length - 1}
				<hr />
			{/if}
		{/each}
	</div>
</div>
