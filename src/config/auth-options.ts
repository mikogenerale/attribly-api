import type { BetterAuthOptions } from "better-auth";
import type { EmailService } from "../email/email.service.js";
import { ConfigService } from "@nestjs/config";

export const emailAndPasswordConfig = (email: EmailService) =>
  ({
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      email.send({
        to: user.email,
        subject: "Reset your password",
        html: `<p>Hi ${user.name}, <a href="${url}">reset your password</a>. This link expires in 1 hour.</p>`,
      });
    },
  }) satisfies BetterAuthOptions["emailAndPassword"];

export const emailVerificationConfig = (email: EmailService) =>
  ({
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      email.send({
        to: user.email,
        subject: "Verify your email",
        html: `<p>Hi ${user.name}, <a href="${url}">verify your email</a>.</p>`,
      });
    },
  }) satisfies BetterAuthOptions["emailVerification"];


export const googleOAuthConfig = (config: ConfigService) => {
    return ({
        clientId: config.getOrThrow("GOOGLE_CLIENT_ID"),
        clientSecret: config.getOrThrow("GOOGLE_CLIENT_SECRET"),
    })
}