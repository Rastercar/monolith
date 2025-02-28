<script lang="ts">
	import { apiDeleteUserByIdMutation } from '$lib/api/access-level.queries';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import PageContainer from '$lib/components/layout/PageContainer.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DeletionSuccessMessage from '$lib/components/non-generic/message/DeletionSuccessMessage.svelte';
	import { route } from '$lib/ROUTES';
	import { getAuthContext } from '$lib/store/context';
	import Icon from '@iconify/svelte';
	import { Popover } from 'bits-ui';
	import AccessLevelInfo from './components/AccessLevelInfo.svelte';
	import UpdateAccessLevelForm from './components/UpdateAccessLevelForm.svelte';

	let { data } = $props();

	let editMode = $state(false);

	let accessLevel = $state(data.accessLevel);
	let accessLevelDeleted = $state(false);

	const deleteAccessLevelMutation = apiDeleteUserByIdMutation();

	const deleteAccessLevel = async () => {
		if (!confirm('deletar nível de acesso permanentemente?')) return;
		await deleteAccessLevelMutation
			.mutateAsync(data.accessLevel.id)
			.then(() => (accessLevelDeleted = true));
	};

	const auth = getAuthContext();
	const { user } = $derived(auth);

	let accessLevelIsFixed = $derived(accessLevel.isFixed);

	let isCurrentUserAccessLevel = $derived(accessLevel.id === user?.accessLevel.id);

	let canEditOrDeleteAccessLevel = $derived(!accessLevelIsFixed && !isCurrentUserAccessLevel);
</script>

<PageContainer>
	<PageHeader
		title="Nível de acesso"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ href: route('/client/access-levels'), icon: 'mdi:shield', text: 'níveis de acesso' },
			{
				href: route(`/client/access-levels/[access_level_id=integer]`, {
					access_level_id: accessLevel.id.toString()
				}),
				text: data.accessLevel.id.toString()
			}
		]}
	/>

	<hr class="hr my-4" />

	{#if accessLevelDeleted}
		<DeletionSuccessMessage
			title="Nível de acesso deletado"
			href={route('/client/access-levels')}
		/>
	{:else}
		<div class="card preset-filled-surface-100-900">
			<div class="p-4 flex flex-col md:flex-row items-center gap-4">
				<div class="flex items-center mr-auto type-scale-3">
					{editMode ? 'Editando nível de acesso' : accessLevel.name}
				</div>

				<div>
					{#if accessLevelIsFixed || isCurrentUserAccessLevel}
						<Popover.Root>
							<Popover.Trigger class="badge preset-filled-primary-200-800">
								{isCurrentUserAccessLevel ? 'seu nível de acesso' : 'nível de acesso fixo'}
							</Popover.Trigger>

							<Popover.Portal>
								<Popover.Content
									class="z-30 max-w-64 bg-surface-200-800 p-2"
									align="end"
									sideOffset={8}
								>
									<div class="type-scale-1 text-center">
										{isCurrentUserAccessLevel
											? 'esse é seu nível de acesso e não pode ser editado ou deletado'
											: 'esse é o nível de acesso principal de sua organização e não pode ser editado ou deletado'}
									</div>
								</Popover.Content>
							</Popover.Portal>
						</Popover.Root>
					{/if}

					<LoadableButton
						isLoading={deleteAccessLevelMutation.isPending}
						disabled={!canEditOrDeleteAccessLevel}
						classes="btn-icon mx-2 btn-icon-sm preset-filled-warning-200-800"
						onclick={deleteAccessLevel}
					>
						<Icon icon="mdi:trash" />
					</LoadableButton>

					<button
						disabled={!canEditOrDeleteAccessLevel}
						class="btn-icon btn-icon-sm preset-filled-primary-200-800"
						onclick={() => (editMode = !editMode)}
					>
						<Icon icon={editMode ? 'mdi:pencil-off' : 'mdi:pencil'} />
					</button>
				</div>
			</div>

			<div class="px-4 pb-4">
				{#if editMode}
					<UpdateAccessLevelForm
						{accessLevel}
						formSchema={data.updateAccessLevelForm}
						onUpdate={(updatedAccessLevel) => {
							accessLevel = updatedAccessLevel;
							editMode = false;
						}}
					/>
				{:else}
					<AccessLevelInfo {accessLevel} />
				{/if}
			</div>
		</div>
	{/if}
</PageContainer>
