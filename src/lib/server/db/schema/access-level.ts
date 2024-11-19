import { relations } from 'drizzle-orm';
import { boolean, foreignKey, integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { organization } from './organization';
import { createdAt } from './schema-helpers';
import { user } from './user';

export const accessLevel = pgTable(
	'access_level',
	{
		id: serial().primaryKey().notNull(),
		createdAt,
		name: varchar({ length: 255 }).notNull(),
		description: text().notNull(),
		isFixed: boolean('is_fixed').notNull(),
		permissions: text().array().default(['']).notNull(),
		organizationId: integer('organization_id')
	},
	(table) => ({
		accessLevelOrganizationIdForeign: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: 'access_level_organization_id_foreign'
		})
			.onUpdate('cascade')
			.onDelete('set null')
	})
);

export const accessLevelRelations = relations(accessLevel, ({ one, many }) => ({
	users: many(user),
	organization: one(organization, {
		fields: [accessLevel.organizationId],
		references: [organization.id]
	})
}));
