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
    return this.prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },    // Шукаємо по ID (якщо передали ID)
          { slug: identifier },  // АБО шукаємо по slug (якщо передали slug)
        ],
      },
      include: { 
        images: { orderBy: { order: 'asc' } }, 
        specifications: { orderBy: { order: 'asc' } } 
      },
    });
  }

  create(dto: CreateProductDto) {
    // 🚀 Витягуємо name, щоб згенерувати з нього slug
    const { images, specifications, name, ...data } = dto;
    
    // 🚀 Генеруємо slug
    const generatedSlug = slugify(name, {
      lower: true,      // маленькі літери
      strict: true,     // без спецсимволів
      locale: 'uk',     // правильна транслітерація української
    });

    return this.prisma.product.create({
      data: {
        name,
        slug: generatedSlug, // 🚀 Передаємо згенерований slug в базу
        ...data,
        images: images?.length
          ? { create: images }
          : undefined,
        specifications: specifications?.length
          ? { create: specifications }
          : undefined,
      },
      include: { images: true, specifications: true },
    });
  }

  update(id: string, dto: Partial<CreateProductDto>) {
    const { images, specifications, name, ...data } = dto;
    
    // 🚀 Підготовлюємо об'єкт для оновлення
    const updateData: any = { ...data };
    
    // Якщо при оновленні передали нове ім'я, оновлюємо і slug
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, {
        lower: true,
        strict: true,
        locale: 'uk',
      });
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
}