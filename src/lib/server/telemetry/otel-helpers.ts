import type { TextMapGetter } from '@opentelemetry/api';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';

export const jaegerPropagator = new JaegerPropagator();

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
