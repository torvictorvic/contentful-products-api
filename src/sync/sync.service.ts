import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ContentfulService } from './contentful.service';

@Injectable()
export class SyncService {
  constructor(private readonly contentful: ContentfulService) {}

  @Cron(process.env.SYNC_CRON || '0 * * * *')
  async hourly() {
    await this.contentful.syncOnce();
  }

  async trigger() {
    return { upserts: await this.contentful.syncOnce() };
  }
}
