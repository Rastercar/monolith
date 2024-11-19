import { geometry, index, integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';

export const vehicleTrackerLocation = pgTable(
	'vehicle_tracker_location',
	{
		time: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
		vehicleTrackerId: integer('vehicle_tracker_id').notNull(),
		point: geometry().notNull()
	},
	(table) => ({
		ixTime: index('ix_time').using('btree', table.time.desc().nullsFirst().op('timestamptz_ops')),
		ixTimeVehicleTrackerId: index('ix_time_vehicle_tracker_id').using(
			'btree',
			table.vehicleTrackerId.asc().nullsLast().op('timestamptz_ops'),
			table.time.desc().nullsFirst().op('timestamptz_ops')
		),
		vehicleTrackerLocationPkey: primaryKey({
			columns: [table.time, table.vehicleTrackerId],
			name: 'vehicle_tracker_location_pkey'
		})
	})
);
