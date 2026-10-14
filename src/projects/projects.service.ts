import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { and, asc, eq } from 'drizzle-orm';
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

  async list(headers: Headers) {
    const orgId = await this.activeOrganizationId(headers);
    return this.db
      .select({ id: project.id, name: project.name, gcpProjectId: project.gcpProjectId })
      .from(project)
      .where(eq(project.organizationId, orgId))
      .orderBy(asc(project.name));
  }

  // Returns the GCP project id to query. With a projectId it must belong to the
  // active organization. Without one, it works only if the organization has
  // exactly one project, so single-project organizations keep working unchanged.
  async resolveGcpProjectId(headers: Headers, projectId?: string): Promise<string> {
    const orgId = await this.activeOrganizationId(headers);
    const rows = await this.db
      .select({ gcpProjectId: project.gcpProjectId })
      .from(project)
      .where(and(eq(project.organizationId, orgId), projectId ? eq(project.id, projectId) : undefined))
      .limit(2);

    if (rows.length === 0) {
      throw new NotFoundException(
        projectId ? 'Project not found' : 'No BigQuery project connected to this organization',
      );
    }
    if (rows.length > 1) {
      throw new BadRequestException('projectId is required: this organization has several projects');
    }
    return rows[0].gcpProjectId;
  }
}
