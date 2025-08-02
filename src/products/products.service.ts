import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async paginateAndFilter(q: { page: number; name?: string; category?: string; minPrice?: string; maxPrice?: string }) {
    const take = 5;
    const skip = (q.page - 1) * take;

    const where: FindOptionsWhere<Product> = { isDeleted: false };
    if (q.name) where.name = Like(`%${q.name}%`);
    if (q.category) where.category = q.category;
    if (q.minPrice && q.maxPrice) where.price = Between(Number(q.minPrice), Number(q.maxPrice));
    else if (q.minPrice) where.price = MoreThanOrEqual(Number(q.minPrice));
    else if (q.maxPrice) where.price = LessThanOrEqual(Number(q.maxPrice));

    const [items, total] = await this.repo.findAndCount({
      where, order: { createdAt: 'DESC' }, take, skip,
    });

    return { page: q.page, pageSize: take, total, items };
  }

  async softDelete(id: string) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Product not found');
    p.isDeleted = true;
    await this.repo.save(p);
  }
}
