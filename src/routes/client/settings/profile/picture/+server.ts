import { imageSchema } from '$lib/api/common.schema';
import { updateUserProfilePicture } from '$lib/server/db/repo/user';
import { withAuth } from '$lib/server/middlewares/auth';
import { validateFormWithFailOnError } from '$lib/server/middlewares/validation';
import { s3 } from '$lib/server/services/s3';
import { fail, json } from '@sveltejs/kit';
import path from 'path';

export const PUT = withAuth(async ({ request, locals: { user } }) => {
	const form = await validateFormWithFailOnError(request, imageSchema);

	const { image } = form.data;

	const oldUserProfilePicture = user.profilePicture;

	const key = {
		date: new Date(),
		organizationId: user.organization.id,
		filenameWithExtension: `profile-pic${path.extname(image.name)}`,
		organizationSubFolder: 'user'
	};

	const { fileKey } = await s3.uploadFile(key, image);
	await updateUserProfilePicture(user.id, fileKey);

	// do this only after the new one has been uploaded
	if (oldUserProfilePicture) await s3.deleteFile(oldUserProfilePicture);

	return json(fileKey);
});

export const DELETE = async ({ request, locals }) => {
	const { user } = locals;
	if (!user) throw fail(403);

	if (!user.profilePicture) {
		return json('user does not have a profile picture to delete');
	}

	await s3.deleteFile(user.profilePicture);
	await updateUserProfilePicture(user.id, null);

	return json('profile picture deleted');
};

function xd() {
	const a = PUT(1 as any);
	const b = DELETE(1 as any);
}
