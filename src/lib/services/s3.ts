import { env } from '$lib/private-env';
import { paginateListBuckets, S3Client, S3ServiceException, type Bucket } from '@aws-sdk/client-s3';

class S3Service {
	c!: S3Client;

	constructor() {
		this.c = new S3Client({
			region: env.AWS_REGION,
			credentials: {
				accessKeyId: env.AWS_ACCESS_KEY_ID,
				secretAccessKey: env.AWS_SECRET_ACCESS_KEY
			}
		});
	}

	// TODO: REMOVE ME
	async listBuckets() {
		try {
			const buckets: Bucket[] = [];

			for await (const page of paginateListBuckets({ client: this.c }, {})) {
				if (page.Buckets) buckets.push(...page.Buckets);
			}
			console.log('Buckets: ');
			console.log(buckets.map((bucket) => bucket.Name).join('\n'));
		} catch (caught) {
			// ListBuckets does not throw any modeled errors. Any error caught
			// here will be something generic like `AccessDenied`.
			if (caught instanceof S3ServiceException) {
				console.error(`${caught.name}: ${caught.message}`);
			} else {
				// Something besides S3 failed.
				throw caught;
			}
		}
	}
}

export const s3 = new S3Service();

/** noop to connect to S3 */
export const initS3 = () => null;
