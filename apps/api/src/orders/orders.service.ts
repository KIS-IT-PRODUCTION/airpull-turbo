import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, customerInfo, deliveryCity, deliveryWarehouse } = createOrderDto;
    
    if (!customerInfo || !customerInfo.phone) {
      throw new BadRequestException('Помилка: Контактні дані (номер телефону) обов\'язкові для замовлення');
    }

    return this.prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({
        where: { phone: customerInfo.phone },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            phone: customerInfo.phone,
            name: customerInfo.name,
            role: 'USER',
          },
        });
      } else if (!user.name && customerInfo.name) {
        user = await tx.user.update({
          where: { id: user.id },
          data: { name: customerInfo.name },
        });
      }

      let total = 0;
      const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Товар з ID ${item.productId} не знайдено`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Недостатньо товару "${product.name}". В наявності: ${product.stock}`);
        }

        total += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });
      }

      const order = await tx.order.create({
        data: {
          userId: user.id,
          total,
          status: 'PENDING',
          deliveryCity: deliveryCity, 
          deliveryWarehouse: deliveryWarehouse,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          user: true,
        },
      });

      return order;
    });
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                imageUrl: true,
              }
            }
          }
        }
      }
    });

    return orders.map(order => ({
      ...order,
      totalPrice: order.total
    }));
  }

  // 🚀 НОВИЙ МЕТОД ДЛЯ АДМІНІСТРАТОРА
  async getAllOrders() {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' }, // Найновіші замовлення спочатку
      include: {
        user: true, // Нам потрібен користувач, щоб бачити телефон і ім'я в таблиці
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                imageUrl: true,
              }
            }
          }
        }
      }
    });

    return orders.map(order => ({
      ...order,
      totalPrice: order.total
    }));
  }

  async getOneOrder(id: string) {
  const order = await this.prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });
  if (!order) throw new NotFoundException('Замовлення не знайдено');
  return order;
}
async updateStatus(id: string, status: string) {
  console.log('UPDATING ORDER:', id, 'NEW STATUS:', status); // Подивись у термінал бекенду
  
  const order = await this.prisma.order.findUnique({ where: { id } });
  if (!order) throw new NotFoundException('Замовлення не знайдено');

  return this.prisma.order.update({
    where: { id },
    data: { status },
  });
}
}