<script lang="ts">
	import { createAccessLevelSchema } from '$lib/api/access-level.schema';
	import LoadableButton from '$lib/components/button/LoadableButton.svelte';
	import TextAreaField from '$lib/components/form/TextAreaField.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import AccessLevelPermissionTogglers from '$lib/components/non-generic/form/AccessLevelPermissionTogglers.svelte';
	import { permissionDetails, type permission } from '$lib/constants/permissions';
	import { route } from '$lib/ROUTES';
	import { showSuccessToast } from '$lib/store/toast';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const getAllPermissionsWithSelectStatusAsFalse = () =>
		Object.keys(permissionDetails).reduce((acc, v) => ({ ...acc, [v]: false }), {}) as Record<
			permission,
			boolean
		>;

	const sForm = superForm(data.createAccessLevelForm, {
		validators: zodClient(createAccessLevelSchema),
		dataType: 'json',
		onSubmit({ jsonData }) {
			const selectedPermissions = Object.entries(permissionToToggleStatus)
				.filter(([_, toggled]) => toggled)
				.map(([permission]) => permission);

			jsonData({ ...$form, permissions: selectedPermissions });
		},
		onUpdate: ({ result }) => {
			if (result.type === 'success') {
				showSuccessToast('access level created');
				permissionToToggleStatus = getAllPermissionsWithSelectStatusAsFalse();
			}
		}
	});
	const { form, submitting: isLoading } = sForm;

	/**
	 * key: permission key (eg: CREATE_USER)
	 * val: boolean indicating the permission is selected
	 */
	let permissionToToggleStatus = $state(getAllPermissionsWithSelectStatusAsFalse());
</script>

<form
	class="p-6 max-w-5xl mx-auto"
	method="POST"
	datatype="json"
	action={route('createAccessLevel /client/access-levels/new')}
	use:sForm.enhance
>
	<PageHeader
		title="novo nível de acesso"
		breadCrumbs={[
			{ href: route('/client'), icon: 'mdi:home', text: 'home' },
			{ href: route('/client/access-levels'), icon: 'mdi:shield', text: 'níveis de acesso' },
			{ href: route('/client/access-levels/new'), text: 'cadastro' }
		]}
	/>

	<hr class="hr my-6" />

	<TextField form={sForm} classes="mb-4" name="name" label="Nome" />

	<TextAreaField form={sForm} name="description" label="Descrição" />

	<AccessLevelPermissionTogglers {permissionToToggleStatus} />

	<div class="flex justify-end mt-4">
		<LoadableButton
			isLoading={$isLoading}
			classes="btn preset-filled-primary-200-800 ml-auto mt-auto"
		>
			cadastrar nível de acesso
		</LoadableButton>
	</div>
</form>
