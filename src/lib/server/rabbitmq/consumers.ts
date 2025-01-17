import amqp from 'amqplib';
import consola from 'consola';
import { handleH02TrackerPosition } from '../tracking/h02/position';
import { TRACKER_EVENTS_QUEUE } from './constants';
import { VEHICLE_TRACKER_IMEI_TO_ID_CACHE } from './tracker-id-cache';

type Handler = (msg: amqp.ConsumeMessage | null) => void;

interface RqmConsumer {
	queue: string;
	options: amqp.Options.Consume;
	handler: Handler;
}

export const trackerEventsConsumer: RqmConsumer = {
	queue: TRACKER_EVENTS_QUEUE,
	options: {
		// automatically acknowledge messages
		//
		// this is very important since trackers publishes tons of events and waiting for acknowledgement
		// would incour performance costs, also tracker events are not critical and its no problemn if a few
		// get lost or are not handled
		noAck: true,
		consumerTag: 'monolith_tracker_events_consumer'
	},
	// TODO: correlate tracing deleveries ?
	handler: async (delivery: amqp.ConsumeMessage | null) => {
		// if the delivery is null, the consumer is canceled or the connection
		// is closed we cant do anything so just return
		if (!delivery) return;

		try {
			// tracking events routing keys have the following pattern
			// {protocol}.{type}.{imei}
			//
			// - protocol: the original protocol of the tracker
			// - type: eventy type, eg: "position", "alert", "heartbeat"
			// - imei: the tracking device IMEI
			const routingKey = delivery.fields.routingKey;

			const routingKeyFields = routingKey.split('.');

			if (routingKeyFields.length < 3) {
				consola.error('[RMQ] invalid tracker event routing key');
				return;
			}

			const [protocol, eventType, imei] = routingKeyFields;

			if (!protocol || !eventType || !imei) {
				consola.error('[RMQ] empty tracker event routing key');
				return;
			}

			const protocolAndEvent = `${protocol}.${eventType}`;

			if (protocolAndEvent !== 'h02.location') {
				consola.info(`[RMQ] unknown protocol/event combination: ${protocol}/${eventType}`);
				return;
			}

			const trackerId = await VEHICLE_TRACKER_IMEI_TO_ID_CACHE.get(imei);

			if (!trackerId) {
				consola.info(`[RMQ] tracker of imei: ${imei} not found`);
				return;
			}

			// important await so any error is caught by the try catch block
			await handleH02TrackerPosition(trackerId, delivery.content);
		} catch (err) {
			consola.error('[RMQ] tracker events consumer error', err);
		}
	}
};
