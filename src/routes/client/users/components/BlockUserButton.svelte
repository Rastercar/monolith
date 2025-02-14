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

	const mut = apiSetUserBlockedMutation();

	const blockUserConfirmMsg =
		'block user ? the user will be logged off from all devices and their access will be denied until unblocking';

	const toggleUserBlocked = () => {
		if (!isBlocked && !confirm(blockUserConfirmMsg)) return;

		mut
			.mutateAsync({ userId, block: !isBlocked })
			.then(() => {
				showSuccessToast(`user ${isBlocked ? 'unblocked' : 'blocked'}`);
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
				? 'unblocking'
				: 'unblock user'
			: mut.isPending
				? 'blocking'
				: 'block user'
	);
</script>

<button
	class="btn rounded-none hover:bg-surface-200-800 w-full justify-start"
	onclick={toggleUserBlocked}
>
	<Icon {icon} class={`${mut.isPending ? 'animate-spin' : ''}`} />
	{msg}
</button>
