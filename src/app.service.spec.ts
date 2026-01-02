import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { BigQueryModule } from './big-query/big-query.module';
import { BitrixModule } from './bitrix/bitrix.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { BitrixService } from './bitrix/bitrix.service';
import { BigQueryService } from './big-query/big-query.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BigQueryModule,
        BitrixModule,
        ConfigModule.forRoot({ isGlobal: true }),
        HttpModule,
      ],
      providers: [AppService, BitrixService, BigQueryService],
    })
      .setLogger(new Logger())
      .compile();

    service = module.get<AppService>(AppService);
  });

  it('Integrational test', () => {
    expect(service).toBeDefined();
  });
  it('should load data to bq', async () => {
    await service.executeBitrixQueries();
  });
});
