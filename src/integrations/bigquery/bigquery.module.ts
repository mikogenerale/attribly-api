import { Module } from '@nestjs/common';
import { BigQueryService } from './bigquery.service.js';

@Module({
    providers: [BigQueryService],
    exports: [BigQueryService],
})
export class BigQueryModule {}
