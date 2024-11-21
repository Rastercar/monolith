<script lang="ts">
	import { authStore } from '$lib/store/auth.svelte';
	import { cloudFrontUrl } from '$lib/utils/url';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import type { ComponentProps } from 'svelte';

	interface Props {
		wrapperClass?: string;
		avatarProps?: Exclude<ComponentProps<typeof Avatar>, 'src' | 'fallback'>;
	}

	let { wrapperClass = 'w-32', avatarProps }: Props = $props();

	const { user } = authStore.getValue();

	const src = user?.profilePicture
		? cloudFrontUrl(user.profilePicture)
		: '/img/no-pic-placeholder.png';
</script>

<!-- wrapping the avatar on a div with the same width prevents the avatar from being "resized" if the parent div width cannot contain it -->
<div class={wrapperClass}>
	<Avatar name="profile-picture" {src} {...avatarProps} />
</div>
