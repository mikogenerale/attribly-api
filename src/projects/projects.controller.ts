import { Controller, Get, Req } from '@nestjs/common';
import { OrgRoles } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { ProjectsService } from './projects.service.js';

// Read-only on purpose: projects are created by operators, not by customers.
@Controller('projects')
@OrgRoles(['owner', 'admin', 'member'])
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async list(@Req() req: Request) {
    return { content: await this.projectsService.list(fromNodeHeaders(req.headers)) };
  }
}
