import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BigQueryModule } from './big-query/big-query.module';
import { BitrixModule } from './bitrix/bitrix.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BigQueryModule, BitrixModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
