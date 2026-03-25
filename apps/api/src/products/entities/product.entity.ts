import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  imageUrl: string;

  // ЦЕ ПОЛЕ ОБОВ'ЯЗКОВЕ, БО ФРОНТЕНД ЙОГО ШЛЕ
  @Column({ nullable: true })
  imageAlt: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ type: 'int', default: 1 })
  ice: number;

  @Column({ type: 'int', default: 1 })
  sweet: number;

  @Column({ type: 'int', default: 1 })
  sour: number;

  @Column('json', { nullable: true, default: [] })
  images: { url: string; alt?: string; order?: number }[];

  @Column('json', { nullable: true, default: [] })
  specifications: { key: string; value: string; order?: number }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}