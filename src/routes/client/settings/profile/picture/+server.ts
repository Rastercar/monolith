import { imageSchema } from '$lib/api/common.schema';
import { s3 } from '$lib/services/s3';
import { json, type RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const PUT: RequestHandler = async ({ request, locals }) => {
	const { user } = locals;

	if (!user) throw fail(404);

	const form = await superValidate(request, zod(imageSchema));
	if (!form.valid) fail(400, { form });

	const { image } = form.data;

	const unixTimestamp = Date.now() / 1000;

	const filename = `profile-pic-tz_${unixTimestamp}_${path.extname(image.name)}`;
	const folder = `organization/${user.organization.id}/user/${user.id}`;

	console.log({ folder, filename });

	s3.listBuckets();

	// TODO: ADD A METHOD TO S3 FOLDER THAT GARANTES FOLDER AND UNIX TIMESTAMP NAMING CONVENTION

	//     .s3
	//     .upload(key.clone().into(), image.contents)

	// user::Entity::update_many()
	//     .col_expr(
	//         user::Column::ProfilePicture,
	//         Expr::value(String::from(key.clone())),
	//     )
	//     .filter(user::Column::Id.eq(request_user.id))
	//     .exec(&db)
	//     .await
	//     .map_err(DbError::from)?;

	// if let Some(old_profile_pic) = request_user.profile_picture {
	//     let _ = state.s3.delete(old_profile_pic).await;
	// }

	// Ok(Json(String::from(key)))

	return json('profile picture update successfully');
};
