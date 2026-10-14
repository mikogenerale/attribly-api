import { organization } from "better-auth/plugins";
import type { EmailService } from "../email/email.service.js";

export const organizationPlugin = (email?: EmailService, uiUrl?: string) =>
  organization({
    allowUserToCreateOrganization: false,
    sendInvitationEmail: async ({ email: to, organization, id }) => {
      email?.send({
        to,
        subject: `You're invited to ${organization.name} on Attribly`,
        html: `<p>You've been invited to join ${organization.name} on Attribly. <a href="${uiUrl}/accept-invitation/${id}">Accept invitation</a></p>`,
      });
    },
  });
