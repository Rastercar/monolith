<script lang="ts">
	import type { User } from '$lib/api/user.schema';
	import EmailNotConfirmedWarning from '$lib/components/button/EmailNotConfirmedWarning.svelte';
	import { route } from '$lib/ROUTES';
	import { cloudFrontUrl } from '$lib/utils/url';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		user: User;
	}

	let { user }: Props = $props();
</script>

<div class="sm:card sm:preset-filled-surface-100-900 sm:p-4 sm:rounded-lg">
	<div class="flex space-x-4">
		<div class="h-32">
			<Avatar
				name="profile-picture"
				classes="w-32 h-32"
				src={user.profilePicture
					? cloudFrontUrl(user.profilePicture)
					: '/img/no-pic-placeholder.png'}
				rounded="rounded-full"
			/>
		</div>

		<div class="flex w-full">
			<div class="w-full">
				<div class="flex justify-between">
					<h1 class="text-2xl mb-2">{user.username}</h1>

					<a href={route('/client/configuracoes/perfil')} class="hidden sm:block">
						<button type="button" class="btn preset-filled-primary-200-800">
							<Icon icon="mdi:pencil" />
							Editar
						</button>
					</a>
				</div>

				{#if user.description}
					<span class="opacity-80 block mb-1">Sobre:</span>
					<p>{user.description}</p>
				{:else}
					<p>nenhuma descrição informada</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="mt-4 flex flex-wrap items-center justify-between">
		<div class="flex items-center">
			<Icon icon="mdi:email" class="mr-2 opacity-80" />
			{user.email}
		</div>

		{#if !user.emailVerified}
			<EmailNotConfirmedWarning sendConfirmationEmailTo="user" extraClasses="mt-4" />
		{/if}
	</div>
</div>
