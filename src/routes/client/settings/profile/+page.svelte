<script lang="ts">
	import FileDropzone from '$lib/components/dropzone/FileDropzone.svelte';
	import { authStore } from '$lib/store/auth';
	import { cloudFrontUrl } from '$lib/utils/url';

	$: ({ user } = $authStore);
</script>

{#if user}
	<div class="p-6 max-w-4xl mx-auto space-y-6">
		<h1 class="text-2xl">My profile</h1>

		<hr class="!mt-3" />

		<FileDropzone
			defaultSrc={user.profilePicture ? cloudFrontUrl(user.profilePicture) : undefined}
		/>

		<label class="label">
			<span>Username</span>
			<input class="input" type="text" value={user.username} />
		</label>

		<label class="label">
			<span>Email</span>
			<input class="input" type="email" value={user.email} />
		</label>

		<label class="label">
			<span>description</span>
			<textarea class="textarea" rows="8" value={user.description} />
		</label>
	</div>
{/if}
