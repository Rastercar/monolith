import { relations } from 'drizzle-orm';
import { foreignKey, geometry, integer, pgTable, timestamp, unique } from 'drizzle-orm/pg-core';
import { vehicleTracker } from './vehicle-tracker';

export const vehicleTrackerLastLocation = pgTable(
	'vehicle_tracker_last_location',
	{
		vehicleTrackerId: integer('vehicle_tracker_id').primaryKey().notNull(),
		time: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
		point: geometry().notNull()
	},
	(table) => {
		return {
			vehicleTrackerLastLocationVehicleTrackerIdForeign: foreignKey({
				columns: [table.vehicleTrackerId],
				foreignColumns: [vehicleTracker.id],
				name: 'vehicle_tracker_last_location_vehicle_tracker_id_foreign'
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			vehicleTrackerLastLocationVehicleTrackerIdUnique: unique(
				'vehicle_tracker_last_location_vehicle_tracker_id_unique'
			).on(table.vehicleTrackerId)
		};
	}
);

export const vehicleTrackerLastLocationRelations = relations(
	vehicleTrackerLastLocation,
	({ one }) => ({
		vehicleTracker: one(vehicleTracker, {
			fields: [vehicleTrackerLastLocation.vehicleTrackerId],
			references: [vehicleTracker.id]
		})
	})
);
