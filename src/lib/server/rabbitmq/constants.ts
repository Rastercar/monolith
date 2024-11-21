/**
 * RabbitMQ queue to be binded to the tracker events exchange
 */
export const TRACKER_EVENTS_QUEUE = 'tracker';

/**
 * RabbitMQ queue to publish requests to the mailer service
 */
export const MAILER_QUEUE = 'mailer';

/**
 * RabbitMQ exchange to listen to tracker events, such as positions and alerts
 */
export const TRACKER_EVENTS_EXCHANGE = 'tracker_events';

/**
 * RabbitMQ default exchange (yes, its a empty string)
 */
export const DEFAULT_EXCHANGE = '';
