import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('admin/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  create(@Body() createPromotionDto: any) {
    return this.promotionsService.createPromotion(createPromotionDto);
  }

  @Get()
  findAll() {
    return this.promotionsService.getAllPromotions();
  }

  @Patch(':id/toggle')
  toggleActive(
    @Param('id') id: string, 
    @Body('isActive') isActive: boolean
  ) {
    return this.promotionsService.togglePromotion(id, isActive);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionsService.deletePromotion(id);
  }
}