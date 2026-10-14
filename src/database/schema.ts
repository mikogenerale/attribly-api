import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

// GCP projects an organization has connected. Rows are created by operators
// (SQL or seed), not through the API, because the backend reads BigQuery with
// its own credentials. The foreign key to Better Auth's organization table
// lives in the Supabase migration; Better Auth owns that table, so it is not
// declared here.
export const project = pgTable(
  'project',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull(),
    name: text('name').notNull(),
    gcpProjectId: text('gcp_project_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.organizationId, t.gcpProjectId)],
);
