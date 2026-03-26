import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async createPromotion(data: any) {
    return this.prisma.promotion.create({
      data: {
        name: data.name,
        discountType: data.discountType,
        value: data.value,
        applyToAll: data.applyToAll || false,
        categories: data.categories || [],
        productIds: data.productIds || [],
        isActive: false,
      },
    });
  }

  async getAllPromotions() {
    return this.prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async togglePromotion(id: string, isActive: boolean) {
    const promo = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promo) throw new NotFoundException('Акцію не знайдено');
    if (promo.isActive === isActive) return promo;

    const whereClause: Prisma.ProductWhereInput = {};
    if (!promo.applyToAll) {
      const orConditions: Prisma.ProductWhereInput[] = [];
      
      if (promo.categories.length > 0) {
        orConditions.push({ category: { in: promo.categories, mode: 'insensitive' } });
        orConditions.push({ brand: { in: promo.categories, mode: 'insensitive' } });
      }
      
      if (promo.productIds.length > 0) {
        orConditions.push({ id: { in: promo.productIds } });
      }

      if (orConditions.length > 0) {
        whereClause.OR = orConditions;
      }
    }

    const targetProducts = await this.prisma.product.findMany({ where: whereClause });
    const updatePromises: any[] = [];

    if (isActive) {
      for (const product of targetProducts) {
        const originalPrice = product.oldPrice || product.price;
        let newPrice = originalPrice;

        if (promo.discountType === 'PERCENTAGE') {
          newPrice = originalPrice - (originalPrice * promo.value) / 100;
        } else if (promo.discountType === 'FIXED') {
          newPrice = originalPrice - promo.value;
        }

        if (newPrice < 1) newPrice = 1;

        updatePromises.push(
          this.prisma.product.update({
            where: { id: product.id },
            data: {
              price: Math.round(newPrice),
              oldPrice: originalPrice,
            },
          })
        );
      }
    } else {
      for (const product of targetProducts) {
        if (product.oldPrice) {
          updatePromises.push(
            this.prisma.product.update({
              where: { id: product.id },
              data: {
                price: product.oldPrice,
                oldPrice: null,
              },
            })
          );
        }
      }
    }

    if (updatePromises.length > 0) {
      await this.prisma.$transaction(updatePromises);
    }

    return this.prisma.promotion.update({
      where: { id },
      data: { isActive },
    });
  }

  async deletePromotion(id: string) {
    const promo = await this.prisma.promotion.findUnique({ where: { id } });
    if (promo?.isActive) {
      await this.togglePromotion(id, false);
    }
    return this.prisma.promotion.delete({ where: { id } });
  }
}