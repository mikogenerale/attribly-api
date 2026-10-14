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

    // Table objects reference the BigQuery client, so return plain fields only.
    return tables.map(({ id, metadata }) => ({
      id,
      type: metadata?.type ?? null,
      creationTime: metadata?.creationTime ?? null,
    }));
  }

  async getTableData(clientProjectId: string, datasetId: string, tableId: string, pageToken?: string ) {
    const client = new BigQuery({ projectId: clientProjectId });
    const table = client.dataset(datasetId).table(tableId);

    // Also confirms the table exists, so the ids used below are real BigQuery ids.
    const [metadata] = await table.getMetadata();
    const columns = metadata.schema?.fields ?? [];

    // Views have no stored rows, so tabledata.list fails on them
    // ("Cannot list a table of type VIEW"). Read them through a query instead.
    if (metadata.type === 'VIEW' || metadata.type === 'MATERIALIZED_VIEW') {
      const location = metadata.location as string | undefined;
      // The page token is only valid for the job that produced it, so it travels as "<jobId>:<token>".
      const sep = pageToken?.indexOf(':') ?? -1;
      const job = pageToken && sep > 0
        ? client.job(pageToken.slice(0, sep), { location })
        : (await client.createQueryJob({
            query: `SELECT * FROM \`${clientProjectId}.${datasetId}.${tableId}\``,
            location,
            // Guard against a view that scans a huge table: the query fails instead of billing.
            maximumBytesBilled: '1000000000',
          }))[0];
      const [rows, nextQuery, apiResponse] = await job.getQueryResults({
        maxResults: 50,
        autoPaginate: false,
        ...(pageToken && sep > 0 ? { pageToken: pageToken.slice(sep + 1) } : {}),
      });
      return {
        tableId,
        columns,
        rows,
        totalRows: apiResponse?.totalRows ?? '0',
        nextPageToken: nextQuery?.pageToken ? `${job.id}:${nextQuery.pageToken}` : null,
      };
    }

    const [rows, nextQuery] = await table.getRows({
      maxResults: 50,
      autoPaginate: false,
      ...(pageToken ? { pageToken } : {}),
    });

    return {
      tableId,
      columns,
      rows,
      totalRows: metadata.numRows ?? '0',
      nextPageToken: nextQuery?.pageToken ?? null,
    };
  }
}
