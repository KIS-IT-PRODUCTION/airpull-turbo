import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, items: { productId: string; quantity: number }[]) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Кошик порожній');
    }

    const productIds = items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      throw new BadRequestException('Деякі товари з кошика не знайдено в базі');
    }

    let total = 0;
    const orderItemsData = items.map(item => {
      // 🚀 Додали знак оклику (!) в кінці, щоб заспокоїти TypeScript
      const product = products.find(p => p.id === item.productId)!;
      
      total += product.price * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return { success: true, order };
  }
}