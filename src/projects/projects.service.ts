import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { eq } from 'drizzle-orm';
import type { Auth } from '../auth/auth.js';
import { DRIZZLE, type Db } from '../database/database.module.js';
import { project } from '../database/schema.js';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Db,
    private readonly authService: AuthService<Auth>,
  ) {}

  // The organization always comes from the session, never from the request.
  // Better Auth only lets a user activate organizations they belong to.
  private async activeOrganizationId(headers: Headers): Promise<string> {
    const session = await this.authService.api.getSession({ headers });
    const orgId = session?.session.activeOrganizationId;
    if (!orgId) throw new BadRequestException('No active organization selected');
    return orgId;
  }

  // The organization comes from the session, never from the request.
  // For now each organization has exactly one BigQuery project.
  async resolveClientProjectId(headers: Headers): Promise<string> {
    const orgId = await this.activeOrganizationId(headers);
    const [row] = await this.db
      .select({ gcpProjectId: project.gcpProjectId })
      .from(project)
      .where(eq(project.organizationId, orgId))
      .limit(1);

    if (!row) throw new NotFoundException('No BigQuery project connected to this organization');
    return row.gcpProjectId;
  }
}
