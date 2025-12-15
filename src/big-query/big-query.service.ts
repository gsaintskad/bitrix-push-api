import { Injectable, Logger } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';

@Injectable()
export class BigQueryService {
  private bigquery: BigQuery;
  private logger = new Logger('BigQuery');

  constructor() {
    // Initialize with the credentials from your JSON file
    this.bigquery = new BigQuery({
      projectId: 'up-statistics',
      keyFilename: 'token.json',
    });
  }

  async runQuery(
    sql: string,
    payload?: any,
  ): Promise<{ rows: any[]; payload: any }> {
    try {
      // options can be added here (e.g., location)
      const options = {
        query: sql,
      };

      // Run the query as a job
      const [job] = await this.bigquery.createQueryJob(options);
      this.logger.log(`Job ${job.id} started at:\t${new Date()}.`);

      // Wait for the query to finish
      const [rows] = await job.getQueryResults();
      this.logger.log(`Job ${job.id} done at:\t${new Date()}.`);

      return { rows: rows!, payload };
    } catch (error) {
      this.logger.error('BigQuery Error:', error);
      throw new Error(`Query failed: ${error.message}`);
    }
  }
}
