import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';

@Injectable()
export class BigQueryService {
  private bigquery: BigQuery;

  constructor() {
    // Initialize with the credentials from your JSON file
    this.bigquery = new BigQuery({
      projectId: 'up-statistics',
      keyFilename: 'token.json',
    });
  }

  async runQuery(sql: string): Promise<any[]> {
    try {
      // options can be added here (e.g., location)
      const options = {
        query: sql,
      };

      // Run the query as a job
      const [job] = await this.bigquery.createQueryJob(options);
      console.log(`Job ${job.id} started.`);

      // Wait for the query to finish
      const [rows] = await job.getQueryResults();

      return rows;
    } catch (error) {
      console.error('BigQuery Error:', error);
      throw new Error(`Query failed: ${error.message}`);
    }
  }
}
