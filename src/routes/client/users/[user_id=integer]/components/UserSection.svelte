<script lang="ts">
	import { apiDeleteUserByIdMutation } from '$lib/api/user.queries';
	import type { SimpleUser } from '$lib/api/user.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import { getAuthContext } from '$lib/store/context';
	import { toDateTime } from '$lib/utils/date';
	import { cloudFrontUrl } from '$lib/utils/url';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		user: SimpleUser;
		onUserDeleted: VoidFunction;
	}

	let { user, onUserDeleted }: Props = $props();

	const mutation = apiDeleteUserByIdMutation();

	const auth = getAuthContext();

	const deleteUser = async () => {
		if (!confirm('tem certeza que deseja deletar este usuário? essa ação não é reversível')) return;

		await mutation.mutateAsync(user.id);
		onUserDeleted();
	};
</script>

<div class="sm:card sm:preset-filled-surface-100-900 sm:p-4 sm:rounded-lg">
	<div class="flex space-x-4">
		<div class="h-32">
			<Avatar
				name="profile-pic"
				src={user.profilePicture
					? cloudFrontUrl(user.profilePicture)
					: '/img/no-pic-placeholder.png'}
				classes="w-32 h-32"
				rounded="rounded-full"
			/>
		</div>

		<div class="flex w-full">
			<div class="w-full">
				<div class="flex justify-between">
					<h1 class="text-2xl mb-2">{user.username}</h1>

					{#if auth.user?.id === user.id}
						<div>
							<span class="badge preset-filled-secondary-200-800">é você!</span>
						</div>
					{:else}
						<PermissionGuard requiredPermissions={'DELETE_USER'}>
							<LoadableButton
								classes="btn btn-icon preset-filled-warning-200-800"
								isLoading={mutation.isPending}
								onclick={deleteUser}
							>
								<Icon icon="mdi:trash" />
							</LoadableButton>
						</PermissionGuard>
					{/if}
				</div>

				{#if user.description}
					<span class="opacity-80">Sobre:</span>
					<p>{user.description}</p>
				{:else}
					<p>descrição não informada</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="mt-4 flex justify-between gap-4">
		<div>
			<div class="flex items-center mb-1">
				<Icon icon="mdi:email" class="opacity-80 mr-2" />
				{user.email}
			</div>

			<div class="flex items-center">
				<div
					class={`h-2 w-2 mr-2 rounded-full ${user.emailVerified ? 'bg-success-500' : 'bg-error-500'}`}
				></div>
				<span class="type-scale-1">
					{user.emailVerified ? 'email verificado' : 'email não verificado'}
				</span>
			</div>
		</div>

		<span class="type-scale-1 hidden sm:block mt-auto">
			Cadastrado em: {toDateTime(user.createdAt)}
		</span>
	</div>
</div>
