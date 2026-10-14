import { Module } from '@nestjs/common';
import { StoreService } from './store.service.js';
import { StoreController } from './store.controller.js';
import { BigQueryModule } from '../../integrations/bigquery/bigquery.module.js';

@Module({
  imports: [BigQueryModule],
  providers: [StoreService],
  controllers: [StoreController]
})
export class StoreModule {}
