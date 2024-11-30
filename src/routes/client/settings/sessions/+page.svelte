<script lang="ts">
	import SessionList from '$lib/components/non-generic/session/SessionList.svelte';

	const { data } = $props();
	const { sessions } = data;
</script>

<div class="space-y-6">
	<h1 class="text-2xl">Your web sessions</h1>
	<h2 class="!mt-3 text-surface-700-200-token text-sm">
		This is a list of devices that have logged into your account. Revoke any sessions that you do
		not recognize.
	</h2>

	<SessionList
		{sessions}
		isSessionsFromCurrentlyLoggedUser
		classes="rounded preset-filled-surface-100-900"
	/>
</div>
