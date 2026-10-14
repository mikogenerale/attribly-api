import { Injectable } from '@nestjs/common';
import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { CustomDataset } from './types.js';

@Injectable()
export class BigQueryService {

  async listDatasets(clientProjectId: string): Promise<CustomDataset[]> {
    const client = new BigQuery({ projectId: clientProjectId });
    
    const [datasets] = await client.getDatasets();

    return datasets.map(({ id, metadata, location, projectId, baseUrl }) => ({
      id, metadata, location, projectId, baseUrl
    }));
  }

  async getDataset(clientProjectId: string, datasetId: string) {
    const client = new BigQuery({ projectId: clientProjectId });
    const [metadata] = await client.dataset(datasetId).getMetadata();

    return metadata;
  }

  async getTables(clientProjectId: string, datasetId: string) {
    const client = new BigQuery({ projectId: clientProjectId });
    const dataset = client.dataset(datasetId);

    const [tables] = await dataset.getTables();

    return tables
  }

  async getTableData(clientProjectId: string, datasetId: string, tableId: string, pageToken?: string ) {
    const client = new BigQuery({ projectId: clientProjectId });
    const table = client.dataset(datasetId).table(tableId);

    const [metadata] = await table.getMetadata();

    const [rows, nextQuery] = await table.getRows({
      maxResults: 50,
      autoPaginate: false,
      ...(pageToken ? { pageToken } : {}),
    });

    return {
      tableId,
      columns: metadata.schema?.fields ?? [],
      rows,
      totalRows: metadata.numRows ?? '0',
      nextPageToken: nextQuery?.pageToken ?? null,
    };
  }
}