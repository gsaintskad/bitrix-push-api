import { AppService } from './app.service';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller('app')
export class AppController {
  constructor(@Inject() private service: AppService) {}
  @Get()
  async start() {
    return await this.service.executeBitrixQueries();
  }
}
