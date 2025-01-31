import { diag, DiagConsoleLogger } from '@opentelemetry/api';
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

const srtToBool = (str) => (str ?? '').toLocaleLowerCase() === 'true';

const { JAEGER_URL, OTEL_EXPORT_SPANS_TO_STDOUT, OTEL_DIAG_LOG_LEVEL } = process.env;

const otlptExporter = new OTLPTraceExporter({ url: JAEGER_URL });

const consoleExporter = new ConsoleSpanExporter();

const batchSpanProcessor = new BatchSpanProcessor(otlptExporter);

const spanProcessors = srtToBool(OTEL_EXPORT_SPANS_TO_STDOUT)
	? [batchSpanProcessor, new SimpleSpanProcessor(consoleExporter)]
	: [batchSpanProcessor];

// set the opentelemetry diagnostics to log errors to the console, this is very usefull for
// debugging bad connections to jaeger and other unexpected errors
diag.setLogger(new DiagConsoleLogger(), parseInt(OTEL_DIAG_LOG_LEVEL));

const sdk = new NodeSDK({
	// The name of the service that producing the spans
	serviceName: 'rastercar-monolith',

	// Sends the traces to jaeger
	spanProcessors,

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
		new AmqplibInstrumentation()
	]
});

consola.info('[OTEL] starting telemetry');
sdk.start();

process.on('beforeExit', async () => {
	await sdk.shutdown();
});
