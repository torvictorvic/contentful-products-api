import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentfulService } from './contentful.service';
import { SyncService } from './sync.service';
import { Product } from '../products/product.entity';
import { SyncController } from './sync.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ContentfulService, SyncService],
  controllers: [SyncController],
  exports: [ContentfulService],
})
export class SyncModule {}
