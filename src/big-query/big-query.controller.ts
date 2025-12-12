import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BigQueryService } from './big-query.service';
import { ExecuteQueryDto } from './dto/query.dto';

@Controller('bigquery')
export class BigQueryController {
  constructor(private readonly bigQueryService: BigQueryService) {}

  @Post('execute')
  async executeSql(@Body() body: ExecuteQueryDto) {
    if (!body.sql) {
      throw new HttpException(
        'SQL parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // ⚠️ WARNING: Accepting raw SQL from a client is dangerous (SQL Injection).
    // Ensure this endpoint is protected or only used internally.
    return this.bigQueryService.runQuery(body.sql);
  }
}
