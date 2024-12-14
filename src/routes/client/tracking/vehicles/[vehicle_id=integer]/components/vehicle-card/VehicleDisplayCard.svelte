<script lang="ts">
	import type { Vehicle, updateVehicleSchema } from '$lib/api/vehicle.schema';
	import { showSuccessToast } from '$lib/store/toast';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import UpdateVehicleForm from './UpdateVehicleForm.svelte';
	import VehicleCardInfo from './VehicleCardInfo.svelte';

	interface Props {
		vehicle: Vehicle;
		formSchema: SuperValidated<Infer<typeof updateVehicleSchema>>;
		onVehicleUpdate: (_: Vehicle) => void;
		onVehicleDelete: () => void;
	}

	let { vehicle = $bindable(), formSchema, onVehicleUpdate, onVehicleDelete }: Props = $props();

	let editMode = $state(false);
</script>

<div class="sm:card sm:preset-filled-surface-100-900 sm:p-4 mt-4">
	{#if !editMode}
		<VehicleCardInfo {vehicle} onEditClick={() => (editMode = true)} {onVehicleDelete} />
	{:else}
		<UpdateVehicleForm
			{vehicle}
			{formSchema}
			onVehicleUpdated={(v) => {
				editMode = false;

				showSuccessToast('vehicle updated');
				onVehicleUpdate(v);
			}}
			onEditCanceled={() => (editMode = false)}
		/>
	{/if}
</div>
