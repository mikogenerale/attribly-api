import { Injectable } from '@nestjs/common';
import { BigQueryService } from '../../integrations/bigquery/bigquery.service.js';
import { ProjectsService } from '../../projects/projects.service.js';

@Injectable()
export class StoreService {
    constructor(
        private readonly bigQueryService: BigQueryService,
        private readonly projectsService: ProjectsService,
    ) {}

    // The BigQuery project is always looked up in the project table for the
    // session's active organization, so it never trusts a GCP project or org ID
    // sent by the client. projectId only chooses between that organization's
    // own projects, and may be omitted when it has exactly one.

    async getStores(headers: Headers, projectId?: string) {
        const gcpProjectId = await this.projectsService.resolveGcpProjectId(headers, projectId);
        const stores = await this.bigQueryService.listDatasets(gcpProjectId);
        return { content: stores };
    }

    async getStoreById(headers: Headers, datasetId: string, projectId?: string) {
        const gcpProjectId = await this.projectsService.resolveGcpProjectId(headers, projectId);
        return await this.bigQueryService.getDataset(gcpProjectId, datasetId);
    }

    async getStoreTables(headers: Headers, datasetId: string, projectId?: string) {
        const gcpProjectId = await this.projectsService.resolveGcpProjectId(headers, projectId);
        const tables = await this.bigQueryService.getTables(gcpProjectId, datasetId);
        return { content: tables };
    }

    async getStoreTableData(headers: Headers, datasetId: string, tableId: string, pageToken?: string, projectId?: string) {
        const gcpProjectId = await this.projectsService.resolveGcpProjectId(headers, projectId);
        return await this.bigQueryService.getTableData(gcpProjectId, datasetId, tableId, pageToken);
    }
}
