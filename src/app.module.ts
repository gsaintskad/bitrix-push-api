import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BigqueryModule } from './bigquery/bigquery.module';

@Module({
  imports: [BigqueryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
