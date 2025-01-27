import { getYYYY_MM_DD_HH_MM_SS } from '$lib/utils/date';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, describe, expect, test } from 'vitest';
import { S3Service } from './s3';

const s3Mock = mockClient(S3Client);

describe('S3Service', () => {
	let s3s: S3Service;

	const validS3Key = {
		organizationId: 10,
		organizationSubFolder: 'test',
		filenameWithExtension: 'image.jpeg',
		date: new Date()
	};

	beforeEach(() => {
		s3s = new S3Service();
	});

	describe('createS3Key', () => {
		test('fails if the key has a invalid org id', () => {
			expect(() => s3s.createS3Key({ ...validS3Key, organizationId: 0 })).toThrow();
		});

		test('fails if the key has a invalid subfolder thats too short', () => {
			expect(() => s3s.createS3Key({ ...validS3Key, organizationSubFolder: 'a' })).toThrow();
		});

		test('fails it filenameWithExtension is invalid', () => {
			const invalidCases = ['', '.', '.j', 'a.j', 'file@!.txt'];

			invalidCases.forEach((filenameWithExtension) => {
				expect(() => s3s.createS3Key({ ...validS3Key, filenameWithExtension })).toThrow();
			});
		});

		test('creates a string in the format: organization/<id>/<folder>/<YYYY_MM_DD_HH_MM_SS>_<filename>', () => {
			const cases = ['potato.jpeg', 'file.json'];

			cases.forEach((filenameWithExtension) => {
				expect(s3s.createS3Key({ ...validS3Key, filenameWithExtension })).toBe(
					`organization/${validS3Key.organizationId}/${validS3Key.organizationSubFolder}/${getYYYY_MM_DD_HH_MM_SS(validS3Key.date)}_${filenameWithExtension}`
				);
			});
		});
	});

	describe('uploadFile', () => {
		test('sends the files to the uploadsBucket with the generated key', async () => {
			const { fileKey } = await s3s.uploadFile(validS3Key, new File(['content'], 'mock.txt'));
			expect(fileKey).toEqual(s3s.createS3Key(validS3Key));
		});
	});

	describe('deleteFile', () => {
		const key = 'some-key';

		test('calls S3 DeleteObjectCommand on the uploads bucket with the filekey', async () => {
			s3Mock.on(DeleteObjectCommand).resolves({});
			await s3s.deleteFile(key);

			const deleteCalls = s3Mock.commandCalls(DeleteObjectCommand);

			expect(deleteCalls.length).toBe(1);
			expect(deleteCalls[0].args[0].input).toStrictEqual({ Bucket: s3s.uploadsBucket, Key: key });
		});
	});
});
