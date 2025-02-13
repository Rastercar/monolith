import { relations } from 'drizzle-orm';
import {
	foreignKey,
	integer,
	pgTable,
	serial,
	smallint,
	unique,
	varchar
} from 'drizzle-orm/pg-core';
import { fleet } from './fleet';
import { organization } from './organization';
import { createdAt } from './schema-helpers';
import { vehicleTracker } from './vehicle-tracker';

export const vehicle = pgTable(
	'vehicle',
	{
		id: serial().primaryKey().notNull(),
		createdAt,
		plate: varchar({ length: 255 }).notNull(),
		photo: varchar({ length: 255 }),
		modelYear: smallint('model_year'),
		fabricationYear: smallint('fabrication_year'),
		chassisNumber: varchar('chassis_number', { length: 255 }),
		brand: varchar({ length: 255 }),
		model: varchar({ length: 255 }),
		color: varchar({ length: 255 }),
		additionalInfo: varchar('additional_info', { length: 255 }),
		organizationId: integer('organization_id').notNull(),
		fleetId: integer('fleet_id')
	},
	(table) => ({
		vehicleFleetForeign: foreignKey({
			columns: [table.fleetId],
			foreignColumns: [fleet.id],
			name: 'user_fleet_id_foreign'
		}).onUpdate('cascade'),
		vehicleOrganizationIdForeign: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: 'vehicle_organization_id_foreign'
		}).onUpdate('cascade'),
		vehiclePlateUnique: unique('vehicle_plate_unique').on(table.plate, table.organizationId)
	})
);

export const vehicleRelations = relations(vehicle, ({ one }) => ({
	organization: one(organization, {
		fields: [vehicle.organizationId],
		references: [organization.id]
	}),
	fleet: one(fleet, {
		fields: [vehicle.fleetId],
		references: [fleet.id]
	}),
	vehicleTracker: one(vehicleTracker)
}));
