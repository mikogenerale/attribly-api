import { Dataset } from "@google-cloud/bigquery";

export type CustomDataset = Pick<Dataset, 'id' | 'metadata' | 'location' | 'projectId' | 'baseUrl'>;