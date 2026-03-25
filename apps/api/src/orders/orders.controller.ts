import { Controller, Post, Body, Get, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../auth/auth.guard'; 
import { AdminGuard } from '../auth/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
  @Get(':id')
  getOneOrder(@Param('id') id: string) {
  return this.ordersService.getOneOrder(id);
}
  @UseGuards(AuthGuard)
  @Get()
  getOrders(@Req() req: any) {
    const user = req.user;
    
    if (user.role === 'ADMIN') {
      return this.ordersService.getAllOrders();
    }

    const userId = user.sub || user.id;
    return this.ordersService.getUserOrders(userId);
  }
@UseGuards(AuthGuard, AdminGuard)
 @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const status = typeof body === 'object' ? body.status : body;
    return this.ordersService.updateStatus(id, status);
  }
}