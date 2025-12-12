import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BigQueryModule } from './big-query/big-query.module';

@Module({
  imports: [BigQueryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
