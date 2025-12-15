import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class BitrixService {
  private readonly logger = new Logger(BitrixService.name);
  private readonly webhookUrl: string;
  private readonly ENTITY_TYPE_ID = 1196;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    // Retrieve URL from .env via ConfigService
    const BITRIX_PORTAL_HOST =
      this.config.getOrThrow<string>('BITRIX_PORTAL_HOST');
    const BITRIX_USER_ID = this.config.getOrThrow<string>('BITRIX_USER_ID');
    const BITRIX_API_KEY = this.config.getOrThrow<string>('BITRIX_API_KEY');
    this.webhookUrl = `https://${BITRIX_PORTAL_HOST}/rest/${BITRIX_USER_ID}/${BITRIX_API_KEY}/`;

    if (!this.webhookUrl) {
      this.logger.error(
        'BITRIX_WEBHOOK_URL is not defined in environment variables.',
      );
    }
  }

  /**
   * Generic method to call Bitrix24 REST API using Axios
   */
  private async callMethod(
    method: string,
    params: Record<string, any> = {},
  ): Promise<any> {
    if (!this.webhookUrl) {
      throw new HttpException(
        'Bitrix Webhook URL is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const url = `${this.webhookUrl.replace(/\/+$/, '')}/${method}.json`;

    try {
      // firstValueFrom converts the Observable to a Promise
      const { data } = await firstValueFrom(this.httpService.post(url, params));

      if (data.error) {
        throw new HttpException(
          `Bitrix API Error: ${data.error_description || data.error}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return data.result;
    } catch (error) {
      // Handle Axios errors
      if (error instanceof AxiosError) {
        this.logger.error(
          `Axios Error calling ${method}: ${error.message}`,
          error.response?.data,
        );
        throw new HttpException(
          error.response?.data?.error_description || error.message,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Handle NestJS HttpExceptions (rethrow)
      if (error instanceof HttpException) {
        throw error;
      }

      // Handle generic errors
      this.logger.error(`Unknown error calling ${method}`, error);
      throw new HttpException(
        'Internal Bitrix API Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Fetches all items from the SPA (Entity Type 1196) using pagination.
   */
  async getAllQueries(): Promise<any[]> {
    const allItems: any[] = [];
    let start = 0;
    let hasNext = true;
    const sqlFiled: string = 'ufCrm80_1765794457';
    this.logger.log(
      `Fetching all items for entityTypeId ${this.ENTITY_TYPE_ID}...`,
    );

    while (hasNext) {
      const params = {
        entityTypeId: this.ENTITY_TYPE_ID,
        start: start,
        select: ['id', 'title', sqlFiled], // Select standard + user fields
      };

      const result = await this.callMethod('crm.item.list', params);

      const items = result.items || [];

      if (items.length === 0) {
        hasNext = false;
        break;
      }

      const processed = items.map((item) => {
        return {
          id: item.id,
          title: item.title,
          sql: item[sqlFiled],
        };
      });

      allItems.push(...processed);

      // Bitrix pagination: check 'next' field
      if (result.next) {
        start = result.next;
      } else {
        hasNext = false;
      }

      // Basic throttling: 5 requests per second max to be safe
      await new Promise((r) => setTimeout(r, 200));
    }

    this.logger.log(`Fetched total ${allItems.length} items.`);
    return allItems;
  }
}
