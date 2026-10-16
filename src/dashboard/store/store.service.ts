import { Injectable } from '@nestjs/common';
import { BigQueryService } from '../../integrations/bigquery/bigquery.service.js';
import { ProjectsService } from '../../projects/projects.service.js';

@Injectable()
export class StoreService {
    constructor(
        private readonly bigQueryService: BigQueryService,
        private readonly projectsService: ProjectsService,
    ) {}

    async getStores(headers: Headers) {
        const gcpProjectId = await this.projectsService.resolveClientProjectId(headers);
        const stores = await this.bigQueryService.listDatasets(gcpProjectId);
        return { content: stores };
    }

    // Per-campaign rows of the store's combined ads view.
    async getCombinedStoreAdsPerformance(headers: Headers, storeId: string) {
        const gcpProjectId = await this.projectsService.resolveClientProjectId(headers);
        const content = await this.bigQueryService.getCombinedStoreAdsPerformance(gcpProjectId, storeId);
        return { content };
    }
}
