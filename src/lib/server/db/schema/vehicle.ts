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
		organizationId: integer('organization_id').notNull()
	},
	(table) => ({
		vehicleOrganizationIdForeign: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: 'vehicle_organization_id_foreign'
		}).onUpdate('cascade'),
		vehiclePlateUnique: unique('vehicle_plate_unique').on(table.plate, table.organizationId)
	})
);

export const vehicleRelations = relations(vehicle, ({ one, many }) => ({
	organization: one(organization, {
		fields: [vehicle.organizationId],
		references: [organization.id]
	}),
	vehicleTrackers: many(vehicleTracker)
}));
