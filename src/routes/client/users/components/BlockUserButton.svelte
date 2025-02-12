<script lang="ts">
	import { apiBlockUser, apiUnblockUser } from '$lib/api/user';
	import { showErrorToast, showSuccessToast } from '$lib/store/toast';
	import { promiseWithMinimumTimeOf } from '$lib/utils/promises';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';

	interface Props {
		userId: number;
		isBlocked: boolean;
		onBlockedStatusChange: () => void;
	}

	const { userId, isBlocked, onBlockedStatusChange }: Props = $props();

	const mut = createMutation(() => ({
		mutationFn: () => {
			const promise = isBlocked ? apiUnblockUser(userId) : apiBlockUser(userId);
			return promiseWithMinimumTimeOf(promise, 500);
		}
	}));

	const blockUserConfirmMsg =
		'block user ? the user will be logged off from all devices and their access will be denied until unblocking';

	const toggleUserBlocked = () => {
		if (!isBlocked && !confirm(blockUserConfirmMsg)) return;

		mut
			.mutateAsync()
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
