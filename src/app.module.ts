import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { BigQueryModule } from './big-query/big-query.module';
import { BitrixModule } from './bitrix/bitrix.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BigQueryModule, BitrixModule, ConfigModule.forRoot({isGlobal:true})],
  providers: [AppService],
})
export class AppModule {}
