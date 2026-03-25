import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: { images: { orderBy: { order: 'asc' } }, specifications: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(identifier: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    return this.prisma.product.findFirst({
      where: isUuid ? { id: identifier } : { slug: identifier },
      include: { 
        images: { orderBy: { order: 'asc' } }, 
        specifications: { orderBy: { order: 'asc' } } 
      },
    });
  }

  async searchProducts(query: string) {
    if (!query || query.length < 2) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1, 
        },
      },
      take: 5,
    });
  }

  create(dto: CreateProductDto) {
    const { images, specifications, name, ...data } = dto;
    
    const generatedSlug = slugify(name, {
      lower: true,
      strict: true,
      locale: 'uk',
    });

    return this.prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        ...data,
        images: images?.length ? {
          create: images.map(img => ({
            url: img.url,
            alt: img.alt,
            order: img.order,
          }))
        } : undefined,
        
        specifications: specifications?.length ? {
          create: specifications.map(spec => ({
            key: spec.key,
            value: spec.value,
            order: spec.order,
          }))
        } : undefined,
      },
      include: { images: true, specifications: true },
    });
  }

  update(id: string, dto: Partial<CreateProductDto>) {
    const { images, specifications, name, ...data } = dto;
    
    const updateData: any = { ...data };
    
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, {
        lower: true,
        strict: true,
        locale: 'uk',
      });
    }

    if (images !== undefined) {
      updateData.images = {
        deleteMany: {},
        create: images.map(img => ({
          url: img.url,
          alt: img.alt,
          order: img.order,
        })),
      };
    }

    if (specifications !== undefined) {
      updateData.specifications = {
        deleteMany: {},
        create: specifications.map(spec => ({
          key: spec.key,
          value: spec.value,
          order: spec.order,
        })),
      };
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { images: true, specifications: true },
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async fixMissingSlugs() {
    const products = await this.prisma.product.findMany();
    let updated = 0;

    for (const product of products) {
      if (!product.slug || product.slug === product.id) {
        let generatedSlug = slugify(product.name, {
          lower: true,
          strict: true,
          locale: 'uk',
        });
        generatedSlug = `${generatedSlug}-${product.id.substring(0, 4)}`;

        await this.prisma.product.update({
          where: { id: product.id },
          data: { slug: generatedSlug },
        });
        updated++;
      }
    }

    return { message: `Успішно згенеровано slug для ${updated} товарів!` };
  }
}