# Attribly API

NestJS API for Attribly. It handles sign-in and organizations with Better Auth on Supabase Postgres, and reads each client's data live from BigQuery.

## Stack

- NestJS 12, TypeScript, ES modules (use `.js` in relative imports)
- Better Auth through `@thallesp/nestjs-better-auth`: email and password, Google OAuth, organizations
- Supabase Postgres through the session pooler, queried with Drizzle ORM
- Resend for email
- BigQuery for client data

## Running locally

Requires Node and pnpm.

```bash
pnpm install
cp .env.sample .env.local   # then fill in the values below
pnpm dev                    # runs auth:migrate, then nest start --watch
```

### Environment variables

| Variable | What it is |
| --- | --- |
| `API_PORT` | Port this API listens on |
| `UI_PORT` | Port of the UI, used to build `UI_URL` |
| `UI_URL` | UI origin. Used for CORS, Better Auth trusted origins and email links |
| `DATABASE_URL` | Supabase Postgres connection string (see below) |
| `BETTER_AUTH_URL` | Public URL of this API. Used to build OAuth callback URLs |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender, for example `Attribly <no-reply@mail.yourdomain.com>`. The domain must be verified in Resend |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `BIGQUERY_QUERY_PROJECT_ID` | The app's own GCP project used to run BigQuery queries |

- Write real values. `.env.local` does not expand `${API_PORT}`-style references, so `BETTER_AUTH_URL=http://localhost:${API_PORT}` is read as literal text and fails. Use `http://localhost:4000` and so on.
- `DATABASE_URL` should be the **session pooler** string (`postgres.<ref>@…pooler.supabase.com:5432`). Supabase's direct host (`db.<ref>.supabase.co`) is IPv6-only and fails with `ENOTFOUND` on IPv4 networks.
- Google redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google`.
- BigQuery uses Google application default credentials. Locally, run `gcloud auth application-default login`.

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Apply Better Auth migrations, then start in watch mode |
| `pnpm build` / `pnpm start:prod` | Build, then run `dist/main` |
| `pnpm lint` / `pnpm format` | oxlint / prettier |
| `pnpm test` / `pnpm test:e2e` | Unit / end-to-end tests (vitest) |
| `pnpm auth:migrate` | Create or update Better Auth's tables |
| `pnpm db:new <name>` | New Supabase migration file |
| `pnpm db:push` | Apply pending Supabase migrations |

## Database and migrations

Each table has exactly one owner, so the schema history never splits.

- **Better Auth owns its tables** (`user`, `session`, `account`, `verification`, `organization`, `member`, `invitation`). Change them only through `pnpm auth:migrate`. Config for the CLI is `src/auth/auth.cli.ts`, so keep its plugins in line with `src/auth/auth.ts`.
- **Supabase migrations own every custom table** (`supabase/migrations`). Run `pnpm auth:migrate` first, because custom tables can reference Better Auth's.
- **Drizzle is only for queries.** `src/database/schema.ts` mirrors the tables. After a migration, run `pnpm exec drizzle-kit pull` to refresh it. Never run `drizzle-kit push` or `generate`, since that would change tables outside the Supabase history.

One-time Supabase setup:

```bash
npx supabase init                          # if supabase/config.toml does not exist
npx supabase login
npx supabase link --project-ref <ref>      # the ID in https://<ref>.supabase.co
```

Adding a table:

```bash
pnpm db:new add_something                  # write the SQL in the new file
npx supabase db push --dry-run             # preview
pnpm db:push
```

Never edit a migration that has been pushed. Add a new one. Enable row level security on every table, because Supabase exposes the `public` schema through its Data API.

## Data model

```
Organization
└── Project     a row in Postgres, one per GCP project
    └── Store   a BigQuery dataset in that GCP project, read live
        └── Table
```

- An organization has many projects. A user reaches a project only through an organization they belong to.
- **Projects are created by operators, not through the API.** The backend reads BigQuery with its own credentials, so letting customers type a GCP project ID would let them read other tenants' data:

  ```sql
  insert into project (organization_id, name, gcp_project_id)
  values ('<organization id>', 'Store A', 'their-gcp-project');
  ```

- Stores are not saved in Postgres. They are listed from BigQuery on each request.
- Users cannot create organizations (`allowUserToCreateOrganization: false`). Operators create them.

## API

Global prefix `/api`, URI versioning with `v1` as the default.

**Auth** is served by Better Auth at `/api/auth/*` (unversioned): `sign-up/email`, `sign-in/email`, `sign-in/social`, `sign-out`, `get-session`, password reset, and the organization endpoints. Dashboard routes need a session with an **active organization**.

**Dashboard** routes require a signed-in member (owner, admin or member) of the active organization:

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/api/v1/stores` | Datasets in the organization's project |
| GET | `/api/v1/stores/:storeId/performance` | Per-campaign rows of the store's combined ads view |

The GCP project is always looked up from the project table for the session's active organization (one project per organization for now), never taken from the request.

## Project structure

```
src/
  auth/             Better Auth setup, organization plugin, CLI config
  config/           env loading, auth option helpers
  database/         shared pg pool, Drizzle client, schema
  email/            Resend email service
  projects/         resolves the active organization's GCP project
  dashboard/store/  store endpoints (BigQuery datasets)
  integrations/     BigQuery client
supabase/migrations/  SQL for custom tables
```
