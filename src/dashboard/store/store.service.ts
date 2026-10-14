import { Injectable } from '@nestjs/common';
import { BigQueryService } from '../../integrations/bigquery/bigquery.service.js';

@Injectable()
export class StoreService {
    private readonly clientProjectId = 'bari-group-by-ubec';

    constructor(
        private readonly bigQueryService: BigQueryService
    ) {}

    async getStores() {
        const stores = await this.bigQueryService.listDatasets(this.clientProjectId);
        return { content: stores };
    }

    async getStoreById(datasetId: string) {
        const store = await this.bigQueryService.getDataset(this.clientProjectId, datasetId);
        return store;
    }

    async getStoreTables(datasetId: string) {
        const tables = await this.bigQueryService.getTables(this.clientProjectId, datasetId);
        return { content: tables };
    }

    async getStoreTableData(datasetId: string, tableId: string, pageToken?: string) {
        const tableData = await this.bigQueryService.getTableData(this.clientProjectId, datasetId, tableId, pageToken);
        return tableData;
    }
}
