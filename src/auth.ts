import { betterAuth } from "better-auth";

export const auth = betterAuth({
  basePath: "/api/auth",
  emailAndPassword: { enabled: true },
  // database: <your adapter: Prisma, Drizzle, pg pool, etc.>
  // trustedOrigins: ["http://localhost:3000"],
  // hooks: {},          // only if you'll use @Hook / @BeforeHook / @AfterHook
  // databaseHooks: {},  // only if you'll use @DatabaseHook decorators
});