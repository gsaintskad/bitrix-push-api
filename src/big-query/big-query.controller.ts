import { Controller } from '@nestjs/common';
import { BigQueryService } from './big-query.service';

@Controller('big-query')
export class BigQueryController {
  constructor(private readonly bigQueryService: BigQueryService) {}
}
