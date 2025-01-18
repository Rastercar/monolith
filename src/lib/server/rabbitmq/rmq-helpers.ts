import { context, type Context } from '@opentelemetry/api';
import amqp from 'amqplib';
import { amqpHeadersTextMapGetter, jaegerPropagator } from '../telemetry/opentelemetry';

export function getRmqConnectionErrorInfo(error: unknown) {
	if (error instanceof Error && error.toString().includes('Socket closed')) {
		return { shouldRetry: true, code: 'unknown' };
	}

	if (typeof error !== 'object' || error === null) {
		return { shouldRetry: false, code: 'unknown' };
	}

	const { code } = error as Record<string, unknown>;

	const retryWorthyErrorCodes = [
		/**
		 * Meaning: The connection to the server was refused
		 *
		 * Possible Causes:
		 * - RabbitMQ is not running.
		 * - Firewall or network rule is blocking access.
		 */
		'ECONNREFUSED',

		/**
		 * Meaning: The connection was forcibly closed by the server or network
		 *
		 * Possible Causes:
		 * - Server restart.
		 * - Network disruption.
		 */
		'ECONNRESET',

		/**
		 *
		 * Meaning: The connection attempt timed out
		 *
		 * Possible Causes:
		 * - Network latency or temporary unavailability of the RabbitMQ server.
		 * - Retry Logic: Retry after a short delay.
		 */
		'ETIMEDOUT',

		/**
		 * Meaning: The server’s host is unreachable.
		 *
		 * Possible Causes:
		 * - Network misconfiguration.
		 * - RabbitMQ server’s IP address is incorrect or unreachable.
		 */
		'EHOSTUNREACH',

		/**
		 * Meaning: The network is unreachable.
		 *
		 * Possible Causes:
		 * - Local machine is disconnected from the network.
		 * - Network outages.
		 */
		'ENETUNREACH'
	];

	const shouldRetry = typeof code === 'string' && retryWorthyErrorCodes.includes(code);

	return { shouldRetry, code: code ?? 'unknown' };
}

export function getOtelContextFromDeliveryHeaders(
	delivery: amqp.ConsumeMessage,
	ctx = context.active()
): Context {
	return jaegerPropagator.extract(ctx, delivery.properties.headers, amqpHeadersTextMapGetter);
}
