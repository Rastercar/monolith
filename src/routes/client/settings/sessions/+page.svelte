<script lang="ts">
	import SessionList from '$lib/components/non-generic/session/SessionList.svelte';
	import SettingsPageTitle from '../components/SettingsPageTitle.svelte';

	const { data } = $props();
	let sessions = $state(data.sessions);

	const onSessionDeleted = (sessionPublicId: number) => {
		const idx = sessions.findIndex((s) => s.publicId === sessionPublicId);
		if (idx >= 0) sessions.splice(idx, 1);
	};
</script>

<SettingsPageTitle>My Sessions</SettingsPageTitle>

<p class="mb-6 text-surface-700-200-token type-scale-2">
	This is a list of devices that have logged into your account. Revoke any sessions that you do not
	recognize.
</p>

<SessionList
	{sessions}
	{onSessionDeleted}
	isSessionsFromCurrentlyLoggedUser
	classes="rounded preset-filled-surface-100-900"
/>
