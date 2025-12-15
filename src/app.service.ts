import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BitrixService } from './bitrix/bitrix.service';
import { BigQueryService } from './big-query/big-query.service';
import { log } from 'console';

@Injectable()
export class AppService {
  private logger: Logger = new Logger(AppService.name);
  constructor(
    @Inject() private config: ConfigService,
    @Inject() private bitrix: BitrixService,
    @Inject() private bq: BigQueryService,
  ) {}
  async executeBitrixQueries() {
    const queries = await this.bitrix.getAllQueries();

    const sqls = queries.map((query) => {
      return {
        id: query.id,
        sql: query.sql.endsWith(';') ? query.sql : `${query.sql};`,
      };
    });
    const results = await Promise.allSettled(
      sqls.map((sql) => this.bq.runQuery(sql.sql, sql.id)),
    );
    const successedIds = results.reduce((acc, curr) => {
      curr.status == 'fulfilled' && acc.push(curr.value.payload as number);
      return acc;
    }, [] as number[]);
    const failed = queries
      .filter((query) => !successedIds.some((id) => id == query.id))
      .map((query) => query.id);
    this.logger.warn({ failed, successedIds });


    //TODO: implement batch updates
    for (const id of successedIds) {
      await this.bitrix.moveItemToStage(id, 'success');
    }
    for (const id of failed) {
      await this.bitrix.moveItemToStage(id, 'failed');
    }
  }
}
