import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { BigQueryModule } from './big-query/big-query.module';
import { BitrixModule } from './bitrix/bitrix.module';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app.module';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('Integrational test', () => {
    expect(service).toBeDefined();
  });
});
