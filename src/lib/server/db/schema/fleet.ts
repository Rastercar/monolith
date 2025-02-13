import { relations } from 'drizzle-orm';
import { foreignKey, integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { organization } from './organization';
import { createdAt } from './schema-helpers';
import { vehicle } from './vehicle';

export const fleet = pgTable(
	'fleet',
	{
		id: serial().primaryKey().notNull(),
		createdAt,
		name: varchar({ length: 255 }).notNull(),
		description: text().notNull(),
		organizationId: integer('organization_id')
	},
	(table) => ({
		fleetOrganizationIdForeign: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: 'fleet_organization_id_foreign'
		})
			.onUpdate('cascade')
			.onDelete('set null')
	})
);

export const fleetRelations = relations(fleet, ({ one, many }) => ({
	vehicles: many(vehicle),
	organization: one(organization, { fields: [fleet.organizationId], references: [organization.id] })
}));
