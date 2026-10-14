import { Module } from '@nestjs/common';
import { StoreService } from './store.service.js';
import { StoreController } from './store.controller.js';
import { BigQueryModule } from '../../integrations/bigquery/bigquery.module.js';
import { ProjectsModule } from '../../projects/projects.module.js';

@Module({
  imports: [BigQueryModule, ProjectsModule],
  providers: [StoreService],
  controllers: [StoreController]
})
export class StoreModule {}
