import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
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
import { Server } from 'socket.io';
import type { PluginOption, ViteDevServer } from 'vite';
import { loadEnv } from 'vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import { type KIT_ROUTES } from '../src/lib/ROUTES';

/**
 * initializes opentelemetry on the application when running in dev
 *
 * for production builds, this is done  on /server/telemetry.js
 *
 * this could be done in normal code on the src/directory, but this
 * would complicate matters as it would give the false impression the
 * code there would be responsible for opentelemetry in production.
 *
 * the reason otel for production is on /server/telemetry.js is because
 * the nodejs adapter for sveltekit fucks up the import order of the modules,
 * making libs like amqp be imported before they are patched by their otel
 * instrumentations, breaking telemetry
 */
export const devOpentelemetryPlugin = (): PluginOption => ({
	name: 'openTelemetry',
	configureServer(server) {
		// dont load opentelemetry for testing
		if (server.config.mode === 'test') return;

		const env = loadEnv(server.config.mode, './env', '');

		const otlptExporter = new OTLPTraceExporter({ url: env.JAEGER_URL });

		const consoleExporter = new ConsoleSpanExporter();

		const batchSpanProcessor = new BatchSpanProcessor(otlptExporter);

		const spanProcessors =
			env.OTEL_EXPORT_SPANS_TO_STDOUT === 'true'
				? [batchSpanProcessor, new SimpleSpanProcessor(consoleExporter)]
				: [batchSpanProcessor];

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

		consola.info(`[OTEL] starting telemetry at ${env.JAEGER_URL}`);

		// set the opentelemetry diagnostics to log errors to the console, this is very usefull for
		// debugging bad connections to jaeger and other unexpected errors
		diag.setLogger(
			new DiagConsoleLogger(),
			parseInt(env.OTEL_DIAG_LOG_LEVEL ?? '70') as DiagLogLevel
		);

		sdk.start();

		process.on('beforeExit', async () => {
			await sdk.shutdown();
		});
	}
});

/**
 * sveltekit routes plugin that creates a dict and TS
 * types for the application routes for type safety
 */
export const svelteKitRoutePlugin = () =>
	kitRoutes<KIT_ROUTES>({
		PAGES: {
			'/client/settings/security': {
				explicit_search_params: {
					redirectHereDueToForcePasswordChange: { required: false, type: 'boolean' }
				}
			},
			'/auth/sign-in': {
				explicit_search_params: {
					redirect: { required: false, type: 'string' }
				}
			},
			'/client/tracking/map': {
				explicit_search_params: {
					lookupTracker: { required: false, type: 'number' }
				}
			}
		}
	});

/**
 * Creates a SocketIO server instance attached to the
 * vite development server, this way we can have websockets
 * when running on development mode !
 *
 * this wont run when building to production and therefore
 * we need to create a SocketIO instance in some other way
 * in that case (see server/app.js)
 */
export const devServerSocketIoPlugin = (): PluginOption => ({
	name: 'socketIo',
	configureServer(server: ViteDevServer) {
		// dont configure the socket io server here as this is done on hooks.server.ts
		if (server.httpServer) globalThis.io = new Server(server.httpServer);
	}
});
