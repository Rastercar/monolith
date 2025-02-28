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

<SettingsPageTitle>Minhas Sessões</SettingsPageTitle>

<p class="mb-6 text-surface-700-200-token type-scale-2">
	Essa é uma lista de dispositivos logados a sua conta. Revogue qualquer sessão que não reconheçe.
</p>

<SessionList {sessions} {onSessionDeleted} classes="rounded preset-filled-surface-100-900" />
