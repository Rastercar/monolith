<script lang="ts">
	import type { Vehicle, updateVehicleSchema } from '$lib/api/vehicle.schema';
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

	const onVehicleUpdated = (v: Vehicle) => {
		editMode = false;
		onVehicleUpdate(v);
	};
</script>

{#if !editMode}
	<VehicleCardInfo {vehicle} onEditClick={() => (editMode = true)} {onVehicleDelete} />
{:else}
	<UpdateVehicleForm
		{vehicle}
		{formSchema}
		{onVehicleUpdated}
		onEditCanceled={() => (editMode = false)}
	/>
{/if}
