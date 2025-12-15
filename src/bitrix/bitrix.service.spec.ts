import { Test, TestingModule } from '@nestjs/testing';
import { BitrixService } from './bitrix.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';

describe('BitrixService', () => {
  let service: BitrixService;
  const logger = new Logger('SPEC LOGGER');
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [BitrixService],
    })
      .setLogger(new Logger())
      .compile();

    service = module.get<BitrixService>(BitrixService);
  });

  it('should return query requests', async () => {
    const queries = await service.getAllQueries();
    logger.warn(queries);
  });
});
