import { env } from '$lib/env/private-env';
import { getYYYY_MM_DD_HH_MM_SS } from '$lib/utils/date';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { z } from 'zod';

const objectKeySchema = z.object({
	/**
	 * folder the the file will be inserted to
	 *
	 * must not start nor end with a /
	 */
	organizationSubFolder: z.string(),

	/**
	 * determines the root folder (/organization/:id)
	 */
	organizationId: z.number().gt(0),

	/**
	 * file name with extension
	 */
	filenameWithExtension: z.string().min(1),

	/**
	 * upload date
	 */
	date: z.date()
});

type ObjectKey = z.infer<typeof objectKeySchema>;

class S3Service {
	private c!: S3Client;

	private uploadsBucket!: string;

	constructor() {
		this.c = new S3Client({
			region: env.AWS_REGION,
			credentials: {
				accessKeyId: env.AWS_ACCESS_KEY_ID,
				secretAccessKey: env.AWS_SECRET_ACCESS_KEY
			}
		});

		this.uploadsBucket = env.AWS_S3_UPLOADS_BUCKET;
	}

	private createS3Key(key: ObjectKey) {
		// assert key is valid to avoid uploading unindentifiable crap
		objectKeySchema.parse(key);

		const filenameWithTimestamp = `${getYYYY_MM_DD_HH_MM_SS(key.date)}_${key.filenameWithExtension}`;
		return `organization/${key.organizationId}/${key.organizationSubFolder}/${filenameWithTimestamp}`;
	}

	async uploadFile(key: ObjectKey, file: File) {
		const fileKey = this.createS3Key(key);

		const upload = new Upload({
			client: this.c,
			params: {
				Bucket: this.uploadsBucket,
				Key: fileKey,
				Body: file.stream()
			}
		});

		return { uploadResult: await upload.done(), fileKey };
	}

	deleteFile(key: string) {
		return this.c.send(new DeleteObjectCommand({ Bucket: this.uploadsBucket, Key: key }));
	}
}

export const s3 = new S3Service();

/** noop to connect to S3 */
export const initS3 = () => null;
