import { MAILER_QUEUE } from '$lib/server/rabbitmq/constants';
import { publishJsonToQueue } from '$lib/server/rabbitmq/rabbitmq';

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
	replacements?: Record<string, Record<string, string>>;
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

export async function sendEmail(body: SendEmailBody) {
	return publishJsonToQueue(MAILER_QUEUE, body, { type: OP_SEND_EMAIL });
}

// TODO: send recover password email
// setTimeout(() => {
// 	sendEmail({
// 		uuid: randomUUID(),
// 		to: [{ email: 'rastercar.tests.002@gmail.com' }],
// 		subject: 'test',
// 		bodyHtml: `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <meta name="x-apple-disable-message-reformatting">
//     <title>Hello World Email</title>
//     <style>
//         body {
//             margin: 0;
//             padding: 0;
//             font-family: Arial, sans-serif;
//             background-color: #f4f4f4;
//         }
//         .email-container {
//             max-width: 600px;
//             margin: 0 auto;
//             background-color: #ffffff;
//             border: 1px solid #dddddd;
//             border-radius: 5px;
//             overflow: hidden;
//         }
//         .email-header {
//             background-color: #007BFF;
//             color: #ffffff;
//             padding: 20px;
//             text-align: center;
//             font-size: 24px;
//         }
//         .email-body {
//             padding: 20px;
//             color: #333333;
//             line-height: 1.6;
//         }
//         .email-footer {
//             background-color: #f4f4f4;
//             text-align: center;
//             font-size: 12px;
//             color: #777777;
//             padding: 10px;
//         }
//         a {
//             color: #007BFF;
//             text-decoration: none;
//         }
//     </style>
// </head>
// <body>
//     <table class="email-container" cellpadding="0" cellspacing="0" width="100%">
//         <tr>
//             <td class="email-header">
//                 Hello, World!
//             </td>
//         </tr>
//         <tr>
//             <td class="email-body">
//                 <p>Welcome to this simple email template. This is a basic example of a responsive HTML email.</p>
//                 <p>Feel free to use this template for testing or as a starting point for your email designs.</p>
//                 <p>Check out more <a href="https://example.com" target="_blank">examples here</a>.</p>
//             </td>
//         </tr>
//         <tr>
//             <td class="email-footer">
//                 &copy; 2024 Your Company. All rights reserved.
//             </td>
//         </tr>
//     </table>
// </body>
// </html>`
// 	});
// }, 3_000);
