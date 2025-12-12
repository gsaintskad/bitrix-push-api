import { Module } from '@nestjs/common';
import { BigqueryService } from './bigquery.service';
import { BigqueryController } from './bigquery.controller';

@Module({
  providers: [BigqueryService],
  controllers: [BigqueryController]
})
export class BigqueryModule {}
