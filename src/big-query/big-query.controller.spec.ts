import { Test, TestingModule } from '@nestjs/testing';
import { BigQueryController } from './big-query.controller';
import { BigQueryService } from './big-query.service';

describe('BigQueryController', () => {
  let controller: BigQueryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BigQueryController],
      providers: [BigQueryService],
    }).compile();

    controller = module.get<BigQueryController>(BigQueryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
