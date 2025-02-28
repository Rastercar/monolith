<script lang="ts">
	import { apiDeleteFleetMutation } from '$lib/api/fleet.queries';
	import type { Fleet, updateFleetSchema } from '$lib/api/fleet.schema';
	import PermissionGuard from '$lib/components/guard/PermissionGuard.svelte';
	import UpdateFleetForm from '$lib/components/non-generic/form/UpdateFleetForm.svelte';
	import { showSuccessToast } from '$lib/store/toast';
	import Icon from '@iconify/svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	interface Props {
		fleet: Fleet;
		onFleetDeleted: VoidFunction;
		updateFleetForm: SuperValidated<Infer<typeof updateFleetSchema>>;
	}

	const { fleet, updateFleetForm, onFleetDeleted }: Props = $props();

	let editMode = $state(false);

	const deleteFleetMutation = apiDeleteFleetMutation();

	const deleteFleet = async () => {
		if (!confirm('Deletar frota permanentemente?')) return;

		await deleteFleetMutation.mutateAsync(fleet.id);
		onFleetDeleted();
	};
</script>

{#if !editMode}
	<div class="card preset-filled-surface-100-900 p-4">
		<div>
			<div class="opacity-70">Nome</div>
			{fleet.name}
		</div>

		<div class="mt-4">
			<div class="opacity-70">Descrição</div>
			{fleet.description}
		</div>

		<div class="flex space-x-4 justify-end mt-6">
			<PermissionGuard requiredPermissions="DELETE_FLEET">
				<button class="btn preset-filled-error-200-800" onclick={deleteFleet}>
					<Icon icon="mdi:trash" />
					deletar
				</button>
			</PermissionGuard>

			<PermissionGuard requiredPermissions="UPDATE_FLEET">
				<button
					class="btn preset-filled-primary-500"
					onclick={() => {
						editMode = true;
					}}
				>
					<Icon icon="mdi:pencil" />
					editar
				</button>
			</PermissionGuard>
		</div>
	</div>
{:else}
	<div class="card preset-filled-surface-100-900 p-4">
		<div class="flex mb-2 justify-end">
			<button class="btn preset-filled-warning-200-800" onclick={() => (editMode = false)}>
				<Icon icon="mdi:pencil-off" />
				cancelar
			</button>
		</div>

		<UpdateFleetForm
			fleetId={fleet.id}
			formSchema={updateFleetForm}
			onUpdate={() => {
				showSuccessToast('frota atualizada');
				editMode = false;
			}}
		/>
	</div>
{/if}
