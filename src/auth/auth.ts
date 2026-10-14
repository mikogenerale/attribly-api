import { betterAuth } from "better-auth";
import type { Pool } from "pg";
import type { ConfigService } from "@nestjs/config";
import type { EmailService } from "../email/email.service.js";
import { emailAndPasswordConfig, emailVerificationConfig, googleOAuthConfig } from "../config/auth-options.js";
import { organizationPlugin } from "./organization.js";

export function createAuth(config: ConfigService, email: EmailService, pool: Pool) {
  return betterAuth({
    basePath: "/api/auth",
    database: pool,
    trustedOrigins: [config.get("UI_URL") ?? ""],
    emailAndPassword: emailAndPasswordConfig(email),
    emailVerification: emailVerificationConfig(email),
    socialProviders: {
      google: googleOAuthConfig(config),
    },
    plugins: [organizationPlugin(email, config.get("UI_URL"))],
    advanced: {
      database: {
        generateId: "uuid"
      }
    }
  });
}

export type Auth = ReturnType<typeof createAuth>;