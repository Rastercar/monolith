import { relations } from 'drizzle-orm';
import {
	foreignKey,
	inet,
	integer,
	pgTable,
	serial,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core';
import { bytea } from '../custom-types';
import { createdAt } from './schema-helpers';
import { user } from './user';

export const session = pgTable(
	'session',
	{
		publicId: serial('public_id').notNull(),
		sessionToken: bytea('session_token').primaryKey().notNull(),
		createdAt,
		expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
		userAgent: varchar('user_agent', { length: 255 }).notNull(),
		ip: inet().notNull(),
		userId: integer('user_id').notNull()
	},
	(table) => ({
		sessionUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'session_user_id_fkey'
		}).onDelete('cascade'),
		sessionPublicIdKey: unique('session_public_id_key').on(table.publicId)
	})
);

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));
