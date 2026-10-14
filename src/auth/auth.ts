import { betterAuth } from "better-auth";
import { Pool } from "pg";
import type { ConfigService } from "@nestjs/config";
import type { EmailService } from "../email/email.service.js";
import { emailAndPasswordConfig, emailVerificationConfig, googleOAuthConfig } from "../config/auth-options.js";

export function createAuth(config: ConfigService, email: EmailService) {
  return betterAuth({
    basePath: "/api/auth",
    database: new Pool({ connectionString: config.getOrThrow("DATABASE_URL") }),
    trustedOrigins: [config.get("UI_URL") ?? ""],
    emailAndPassword: emailAndPasswordConfig(email),
    emailVerification: emailVerificationConfig(email),
    socialProviders: {
      google: googleOAuthConfig(config),
    },
    advanced: {
      database: {
        generateId: "uuid"
      }
    }
  });
}

export type Auth = ReturnType<typeof createAuth>;