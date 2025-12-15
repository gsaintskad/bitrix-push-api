import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BitrixService } from './bitrix/bitrix.service';
import { BigQueryService } from './big-query/big-query.service';

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
    this.logger.log(queries);
  }
}
