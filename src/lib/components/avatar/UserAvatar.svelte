<script lang="ts">
	import { authStore } from '$lib/store/auth';
	import { cloudFrontUrl } from '$lib/utils/url';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { AvatarProps } from '@skeletonlabs/skeleton/dist/components/Avatar/Avatar.svelte';

	export let avatarProps: Exclude<AvatarProps, 'src' | 'fallback'> = {
		width: 'w-32',
		rounded: 'rounded-full'
	};

	$: ({ user } = $authStore);
</script>

<!-- wrapping the avatar on a div with the same width prevents the avatar from being "resized" if the parent div width cannot contain it -->
<div class={avatarProps.width}>
	<Avatar
		src={user?.profilePicture ? cloudFrontUrl(user.profilePicture) : '/img/no-pic-placeholder.png'}
		fallback="/img/no-pic-placeholder.png"
		{...avatarProps}
	/>
</div>
