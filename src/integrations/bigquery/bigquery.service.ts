import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';
import { CustomDataset } from './types.js';

@Injectable()
export class BigQueryService {

  // Stores = datasets of the client's GCP project.
  async listDatasets(clientProjectId: string): Promise<CustomDataset[]> {
    const client = new BigQuery({ projectId: clientProjectId });
    
    const [datasets] = await client.getDatasets();

    return datasets.map(({ id, metadata, location, projectId, baseUrl }) => ({
      id, metadata, location, projectId, baseUrl
    }));
  }

  // Aggregates the combined ads view per campaign in SQL; ROAS = conversion value / cost.
  async getCombinedStoreAdsPerformance(clientProjectId: string, datasetId: string) {
    const client = new BigQuery({ projectId: clientProjectId });
    const [job] = await client.createQueryJob({
      query: `
        SELECT
          platform,
          campaign_name,
          campaign_id,
          CAST(SUM(clicks) AS FLOAT64) AS clicks,
          CAST(SUM(impressions) AS FLOAT64) AS impressions,
          CAST(SUM(cost) AS FLOAT64) AS cost,
          SAFE_DIVIDE(SUM(conversion_value), SUM(cost)) AS roas
        FROM \`${clientProjectId}.${datasetId}.v_combined_ads_performance\`
        GROUP BY platform, campaign_id, campaign_name
        ORDER BY platform, clicks DESC
      `,
      // Fails instead of billing if the view ever scans far more than expected.
      maximumBytesBilled: '1000000000',
    });
    const [rows] = await job.getQueryResults();
    return rows;
  }
}
