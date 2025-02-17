import { imageSchema } from '$lib/api/common.schema';
import { updateUserProfilePicture } from '$lib/server/db/repo/user';
import { acl } from '$lib/server/middlewares/auth';
import { validateForm } from '$lib/server/middlewares/validation';
import { s3 } from '$lib/server/services/s3';
import { error, json } from '@sveltejs/kit';
import path from 'path';

export const PUT = async ({ request, locals }) => {
	const { user, orgId } = acl(locals);

	const form = await validateForm(request, imageSchema);
	if (!form.valid) {
		error(400, { message: form.errors.image?.[0] ?? 'invalid image' });
	}

	const { image } = form.data;

	const oldUserProfilePicture = user.profilePicture;

	const key = {
		date: new Date(),
		organizationId: orgId,
		filenameWithExtension: `profile-pic${path.extname(image.name)}`,
		organizationSubFolder: `user/${user.id}`
	};

	const { fileKey } = await s3.uploadFile(key, image);
	await updateUserProfilePicture(user.id, fileKey);

	// do this only after the new one has been uploaded
	if (oldUserProfilePicture) await s3.deleteFile(oldUserProfilePicture);

	return json(fileKey);
};

export const DELETE = async ({ locals }) => {
	const { user } = acl(locals);

	if (!user.profilePicture) {
		return json('user does not have a profile picture to delete');
	}

	await s3.deleteFile(user.profilePicture);
	await updateUserProfilePicture(user.id, null);

	return json('profile picture deleted');
};
