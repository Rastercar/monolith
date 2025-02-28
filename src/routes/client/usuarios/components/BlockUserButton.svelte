<script lang="ts">
	import { apiSetUserBlockedMutation } from '$lib/api/user.queries';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';

	interface Props {
		userId: number;
		isBlocked: boolean;
		onBlockedStatusChange: VoidFunction;
	}

	const { userId, isBlocked, onBlockedStatusChange }: Props = $props();

	const mut = apiSetUserBlockedMutation({ minTime: 500 });

	const blockUserConfirmMsg =
		'bloquear usuário ? o usuário será deslogado de todos os dispositivos e seu acesso será negado até desbloqueá-lo';

	const toggleUserBlocked = () => {
		if (!isBlocked && !confirm(blockUserConfirmMsg)) return;

		mut
			.mutateAsync({ userId, block: !isBlocked })
			.then(() => {
				showSuccessToast(`usuário ${isBlocked ? 'desbloqueado' : 'bloqueado'}`);
				onBlockedStatusChange();
			})
			.catch(showErrorToast);
	};

	const icon = $derived(
		mut.isPending ? 'mdi:loading' : isBlocked ? 'mdi:user-plus' : 'mdi:user-lock'
	);

	const msg = $derived(
		isBlocked
			? mut.isPending
				? 'desloqueando'
				: 'desbloquear usuário'
			: mut.isPending
				? 'bloqueando'
				: 'bloquear usuário'
	);
</script>

<button
	class="btn rounded-none hover:bg-surface-200-800 w-full justify-start"
	onclick={toggleUserBlocked}
>
	<Icon {icon} class={`${mut.isPending ? 'animate-spin' : ''}`} />
	{msg}
</button>
