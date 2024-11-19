import { relations } from 'drizzle-orm';
import { foreignKey, index, integer, pgTable, serial, unique, varchar } from 'drizzle-orm/pg-core';
import { trackerModel } from '../custom-types';
import { organization } from './organization';
import { createdAt } from './schema-helpers';
import { simCard } from './sim-card';
import { vehicle } from './vehicle';
import { vehicleTrackerLastLocation } from './vehicle-tracker-last-location';

export const vehicleTracker = pgTable(
	'vehicle_tracker',
	{
		id: serial().primaryKey().notNull(),
		createdAt,
		model: trackerModel().notNull(),
		imei: varchar({ length: 255 }).notNull(),
		organizationId: integer('organization_id').notNull(),
		vehicleId: integer('vehicle_id')
	},
	(table) => ({
		idxVehicleTrackerImei: index('idx_vehicle_tracker_imei').using(
			'btree',
			table.imei.asc().nullsLast().op('text_ops')
		),
		vehicleTrackerOrganizationIdForeign: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: 'vehicle_tracker_organization_id_foreign'
		}).onUpdate('cascade'),
		vehicleTrackerVehicleIdForeign: foreignKey({
			columns: [table.vehicleId],
			foreignColumns: [vehicle.id],
			name: 'vehicle_tracker_vehicle_id_foreign'
		})
			.onUpdate('cascade')
			.onDelete('set null'),
		vehicleTrackerImeiUnique: unique('vehicle_tracker_imei_unique').on(
			table.imei,
			table.organizationId
		),
		vehicleTrackerVehicleIdUnique: unique('vehicle_tracker_vehicle_id_unique').on(table.vehicleId)
	})
);

export const vehicleTrackerRelations = relations(vehicleTracker, ({ one, many }) => ({
	organization: one(organization, {
		fields: [vehicleTracker.organizationId],
		references: [organization.id]
	}),
	vehicle: one(vehicle, {
		fields: [vehicleTracker.vehicleId],
		references: [vehicle.id]
	}),
	simCards: many(simCard),
	vehicleTrackerLastLocations: many(vehicleTrackerLastLocation)
}));
