import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env.local' });

// Used only for `drizzle-kit pull`, which refreshes src/database/schema.ts from
// the live database. Migrations are owned by the Supabase CLI
// (supabase/migrations), so never run `drizzle-kit push` or `generate` here.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './src/database',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
