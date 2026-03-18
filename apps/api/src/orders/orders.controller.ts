import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiProperty } from '@nestjs/swagger';

// Описуємо, що чекаємо від фронтенду
class CreateOrderDto {
  @ApiProperty({ example: 'uuid-користувача' })
  userId: string;
  
  @ApiProperty({ example: [{ productId: 'uuid-товару', quantity: 2 }] })
  items: { productId: string; quantity: number }[];
}

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  createOrder(@Body() body: CreateOrderDto) {
    return this.ordersService.createOrder(body.userId, body.items);
  }
}