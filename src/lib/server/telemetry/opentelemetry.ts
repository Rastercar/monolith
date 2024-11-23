import { env } from '$lib/private-env';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { NodeSDK } from '@opentelemetry/sdk-node';

// set the opentelemetry diagnostics to log errors to the console, this is very usefull for
// debugging bad connections to jaeger and other unexpected errors
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const sdk = new NodeSDK({
	// The name of the service that producing the spans
	serviceName: 'rastercar-api',

	// Sends the traces to jaeger
	traceExporter: new OTLPTraceExporter({ url: env.JAEGER_URL }),

	// Set the tracing context propagation for text maps (http headers, rabbitmq headers, etc)
	// to use the jaeger format
	textMapPropagator: new JaegerPropagator(),

	// The instrumentations (aka library hooks) to
	instrumentations: [
		// modifies amqplib publishes and consume functions to send opentelemetry
		// data using the trace format for jaeger
		//
		// we can have some interesting hooks here in the future
		// consumeHook, consumeEndHook, publishConfirmHook, useLinksForConsume
		new AmqplibInstrumentation({
			publishHook: (_, { exchange, routingKey }) => {
				const exchangeText = exchange === '' ? `default exchange` : `exchange: "${exchange}"`;

				console.log(`[RMQ] published to ${exchangeText} with routing key: "${routingKey}"`);
			}
		})
	]
});

console.log('[OTEL] starting telemetry');
sdk.start();

process.on('beforeExit', async () => {
	await sdk.shutdown();
});

/** noop to register open telemetry */
export const initTelemetry = () => null;
