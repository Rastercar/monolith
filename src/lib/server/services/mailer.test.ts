import * as rmq from '$lib/server/rabbitmq/rabbitmq';
import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, test, vi } from 'vitest';
import { MAILER_QUEUE } from '../rabbitmq/constants';
import {
	loadTemplate,
	OP_SEND_EMAIL,
	sendConfirmEmailAddressEmail,
	sendEmail,
	sendRecoverPasswordEmail,
	sendWellcomeEmail,
	type emailTemplate
} from './mailer';

vi.mock('$lib/server/rabbitmq/rabbitmq');
vi.mock('path');
vi.mock('fs');

const pathMock = vi.mocked(path);
const rmqMock = vi.mocked(rmq);
const fsMock = vi.mocked(fs);

describe('loadTemplate', () => {
	test('should resolve the correct file path and load the template', () => {
		const templateName = 'confirm-email';
		const resolvedPath = '/absolute/path/to/static/templates/email/test-template.hbs';
		const templateContent = 'template content';

		pathMock.resolve.mockReturnValueOnce(resolvedPath);
		fsMock.readFileSync.mockReturnValueOnce(templateContent);

		const result = loadTemplate(templateName);

		expect(pathMock.resolve).toHaveBeenCalledWith(`./static/templates/email/${templateName}.hbs`);
		expect(fsMock.readFileSync).toHaveBeenCalledWith(resolvedPath, 'utf-8');

		expect(result).toBe(templateContent);
	});

	test('should throw an error if the template file is not found', () => {
		const templateName = 'non-existent-template';
		const resolvedPath = '/absolute/path/to/static/templates/email/non-existent-template.hbs';

		pathMock.resolve.mockReturnValueOnce(resolvedPath);

		fsMock.readFileSync.mockImplementation(() => {
			throw new Error();
		});

		expect(() => loadTemplate(templateName as emailTemplate)).toThrow();
	});
});

test('sendEmail - just publishes to the rmq mailer queue', () => {
	const email = { uuid: 'mock', to: [], subject: 'mock', bodyHtml: 'mock' };

	sendEmail(email);

	expect(rmqMock.publishJsonToQueue).toHaveBeenCalledWith(MAILER_QUEUE, email, {
		type: OP_SEND_EMAIL
	});
});

test('sendRecoverPasswordEmail - just calls sendEmail with the recover password email template', () => {
	pathMock.resolve.mockReturnValueOnce('/some-path');
	fsMock.readFileSync.mockReturnValueOnce('content');

	sendRecoverPasswordEmail({
		email: 'test',
		replacements: { username: 'jhon', resetPasswordLink: 'wick' }
	});

	expect(rmqMock.publishJsonToQueue).toHaveBeenLastCalledWith(MAILER_QUEUE, expect.anything(), {
		type: OP_SEND_EMAIL
	});
});

test('sendWellcomeEmail - just calls sendEmail with the wellcome email template', () => {
	pathMock.resolve.mockReturnValueOnce('/some-path');
	fsMock.readFileSync.mockReturnValueOnce('content');

	sendWellcomeEmail({ email: 'test', replacements: { username: 'jhon' } });

	expect(rmqMock.publishJsonToQueue).toHaveBeenLastCalledWith(MAILER_QUEUE, expect.anything(), {
		type: OP_SEND_EMAIL
	});
});

test('sendConfirmEmailAddressEmail - just calls sendEmail with the confirm email address template', () => {
	pathMock.resolve.mockReturnValueOnce('/some-path');
	fsMock.readFileSync.mockReturnValueOnce('content');

	sendConfirmEmailAddressEmail({
		email: 'test',
		subject: 'confirm email address',
		replacements: {
			title: 'title',
			confirmationLink: 'wick'
		}
	});

	expect(rmqMock.publishJsonToQueue).toHaveBeenLastCalledWith(MAILER_QUEUE, expect.anything(), {
		type: OP_SEND_EMAIL
	});
});
