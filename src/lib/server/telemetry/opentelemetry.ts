import { env } from '$lib/env/private-env';
import { diag, DiagConsoleLogger, type TextMapGetter } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
	BatchSpanProcessor,
	ConsoleSpanExporter,
	SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-base';
import consola from 'consola';

export const jaegerPropagator = new JaegerPropagator();

const otlptExporter = new OTLPTraceExporter({ url: env.JAEGER_URL });

const consoleExporter = new ConsoleSpanExporter();

/**
 * text map getter for Amqp headers, this allows getting
 * the context of a rabbitmq message sent by another service
 */
export const amqpHeadersTextMapGetter: TextMapGetter = {
	get(carrier, key) {
		return carrier[key] || undefined;
	},
	keys(carrier) {
		return Object.keys(carrier);
	}
};

const batchSpanProcessor = new BatchSpanProcessor(otlptExporter);

const spanProcessors = env.EXPORT_OTEL_SPANS_TO_STDOUT
	? [batchSpanProcessor, new SimpleSpanProcessor(consoleExporter)]
	: [batchSpanProcessor];

// set the opentelemetry diagnostics to log errors to the console, this is very usefull for
// debugging bad connections to jaeger and other unexpected errors
diag.setLogger(new DiagConsoleLogger(), env.OTEL_DIAG_LOG_LEVEL);

const sdk = new NodeSDK({
	// The name of the service that producing the spans
	serviceName: 'rastercar-monolith',

	// Sends the traces to jaeger
	spanProcessors,

	// Set the tracing context propagation for text maps (http headers, rabbitmq headers, etc)
	// to use the jaeger format
	textMapPropagator: jaegerPropagator,

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
				consola.info(`[RMQ] published to ${exchangeText} with routing key: "${routingKey}"`);
			}
		})
	]
});

let otelStarted = false;

export const initTelemetry = () => {
	if (otelStarted) return;

	consola.info('[OTEL] starting telemetry');

	sdk.start();

	process.on('beforeExit', async () => {
		await sdk.shutdown();
	});

	otelStarted = true;
};
