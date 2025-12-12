import { Module } from '@nestjs/common';
import { BigQueryService } from './big-query.service';
import { BigQueryController } from './big-query.controller';

@Module({
  controllers: [BigQueryController],
  providers: [BigQueryService],
})
export class BigQueryModule {}
