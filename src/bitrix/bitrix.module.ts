import { Module } from '@nestjs/common';
import { BitrixService } from './bitrix.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [BitrixService],
  exports: [BitrixService],
})
export class BitrixModule {}
