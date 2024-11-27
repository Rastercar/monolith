import { MAILER_QUEUE } from '$lib/server/rabbitmq/constants';
import { publishJsonToQueue } from '$lib/server/rabbitmq/rabbitmq';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * Mailer RPC operation to send a email
 */
const OP_SEND_EMAIL = 'sendEmail';

interface Recipient {
	/**
	 * recipient email address
	 */
	email: string;

	/**
	 *   An array of email addresses to send the email to and the
	 * replacements to use on the email html for that email address, eg:
	 * ```ts
	 * { email: "jhon@gmail.com", replacements: { "name": "jhon" } }
	 * ```
	 */
	replacements?: Record<string, string>;
}

interface SendEmailBody {
	/**
	 * A unique identifier for the email sending request, this is so the client can store this on
	 * his side and use this identifier on future requests, such as getting metrics for this uuid
	 */
	uuid: string;

	/**
	 * The RFC5322 email address to be used to send the email, if undefined the service default address is used
	 */
	sender?: string;

	/**
	 * Email recipients, should contain at least one address
	 */
	to: Recipient[];

	/**
	 * List of email addresses to show on the email reply-to options, only makes
	 * sense if at least one email address different than the sender is used
	 */
	replyToAddresses?: string[];

	subject: string;

	bodyHtml: string;

	bodyText?: string;

	/**
	 * If tracking for email events such as clicks and opens should be enabled
	 */
	enableTracking?: boolean;
}

type template = 'recover-password' | 'confirm-email';

export function loadTemplate(template: template) {
	const filepath = `./static/templates/email/${template}.hbs`;

	const absolutePath = path.resolve(filepath);
	return readFileSync(absolutePath, 'utf-8');
}

function sendEmail(body: SendEmailBody) {
	return publishJsonToQueue(MAILER_QUEUE, body, { type: OP_SEND_EMAIL });
}

export async function sendRecoverPasswordEmail(
	email: string,
	replacements: { username: string; resetPasswordLink: string }
) {
	return sendEmail({
		uuid: randomUUID(),
		to: [{ email, replacements }],
		subject: 'Rastercar - account recovery',
		bodyHtml: loadTemplate('recover-password')
	});
}

export async function sendConfirmEmailAddressEmail(
	email: string,
	replacements: { title: string; confirmationLink: string }
) {
	return sendEmail({
		uuid: randomUUID(),
		to: [{ email, replacements }],
		subject: 'Rastercar - confirm your email address',
		bodyHtml: loadTemplate('confirm-email')
	});
}
