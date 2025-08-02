import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';

type ContentfulEntry = {
  sys: { id: string };
  fields: {
    sku?: string; name?: string; brand?: string; model?: string;
    category?: string; color?: string; price?: number; currency?: string; stock?: number;
  };
};

@Injectable()
export class ContentfulService {
  private readonly logger = new Logger(ContentfulService.name);
  private readonly base: string;
  private readonly space: string;
  private readonly env: string;
  private readonly token: string;
  private readonly ctype: string;

  constructor(
    private readonly cfg: ConfigService,
    @InjectRepository(Product) private readonly repo: Repository<Product>,
  ) {
    this.base  = this.cfg.get<string>('CONTENTFUL_CDN_BASE')!;
    this.space = this.cfg.get<string>('CONTENTFUL_SPACE_ID')!;
    this.env   = this.cfg.get<string>('CONTENTFUL_ENVIRONMENT')!;
    this.token = this.cfg.get<string>('CONTENTFUL_ACCESS_TOKEN')!;
    this.ctype = this.cfg.get<string>('CONTENTFUL_CONTENT_TYPE')!;
  }

  async fetchEntries(): Promise<ContentfulEntry[]> {
    const url = `${this.base}/spaces/${this.space}/environments/${this.env}/entries`;
    const { data } = await axios.get(url, {
      params: { access_token: this.token, content_type: this.ctype, limit: 1000 },
    });
    return data.items as ContentfulEntry[];
  }

  async syncOnce(): Promise<number> {
    const items = await this.fetchEntries();
    let upserts = 0;

    for (const it of items) {
      const cfid = it.sys.id;
      const found = await this.repo.findOne({ where: { contentfulId: cfid } });

      // No resucitar si fue eliminado por el usuario
      if (found?.isDeleted) continue;

      const payload: Partial<Product> = {
        contentfulId: cfid,
        sku: it.fields.sku ?? '',
        name: it.fields.name ?? '',
        brand: it.fields.brand ?? '',
        model: it.fields.model ?? '',
        category: it.fields.category ?? '',
        color: it.fields.color ?? '',
        price: it.fields.price ?? null,
        currency: it.fields.currency ?? null,
        stock: it.fields.stock ?? 0,
      };

      if (found) {
        await this.repo.update({ contentfulId: cfid }, payload);
      } else {
        await this.repo.save(this.repo.create(payload));
      }
      upserts++;
    }

    this.logger.log(`Sync upserts: ${upserts}`);
    return upserts;
  }
}
