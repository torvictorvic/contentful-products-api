import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, Between } from 'typeorm';
import { Product } from '../products/product.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async percentageDeleted() {
    const total = await this.repo.count();
    const deleted = await this.repo.count({ where: { isDeleted: true } });
    return { percentage: total ? +(deleted / total * 100).toFixed(2) : 0 };
  }

  async percentageNonDeletedWithPrice(params: { withPrice: boolean; start?: string; end?: string }) {
    const total = await this.repo.count({ where: { isDeleted: false } });

    const where: any = { isDeleted: false };
    where.price = params.withPrice ? Not(null) : null;
    if (params.start && params.end) where.createdAt = Between(new Date(params.start), new Date(params.end));

    const subset = await this.repo.count({ where });
    return { percentage: total ? +(subset / total * 100).toFixed(2) : 0 };
  }

  async topCategories(limit = 5) {
    const rows = await this.repo.createQueryBuilder('p')
      .select('p.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('p.isDeleted = false')
      .groupBy('p.category')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
    return rows;
  }
}
