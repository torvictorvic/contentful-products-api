import { Entity, PrimaryGeneratedColumn, Column, Index, UpdateDateColumn } from 'typeorm';

@Entity('products')
@Index(['name', 'category'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // id for Contentful (sys.id) => upsert
  @Column({ unique: true })
  contentfulId: string;

  @Column() sku: string;
  @Column() name: string;
  @Column() brand: string;
  @Column() model: string;
  @Column() category: string;
  @Column() color: string;

  @Column({ type: 'numeric', nullable: true })
  price: number | null;

  @Column({ type: 'varchar', length: 8, nullable: true })
  currency: string | null;

  @Column({ type: 'int', default: 0 })
  stock: number;

  // Soft delete local (para que no reaparezcan tras reinicio)
  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
