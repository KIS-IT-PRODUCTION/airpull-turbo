import { IsArray, IsInt, IsString, Min, ValidateNested, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerInfoDto {
  @ApiProperty({ example: 'Олександр' })
  @IsString()
  @IsNotEmpty({ message: 'Ім\'я не може бути порожнім' })
  name: string;

  @ApiProperty({ example: '+380991234567' })
  @IsString()
  @IsNotEmpty({ message: 'Номер телефону обов\'язковий' })
  phone: string;
}

export class OrderItemDto {
  @ApiProperty({ example: 'uuid-товару' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: CustomerInfoDto })
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customerInfo: CustomerInfoDto;

  @ApiProperty({ example: 'Київ', required: false })
  @IsString()
  @IsOptional()
  deliveryCity?: string;

  @ApiProperty({ example: 'Відділення №1', required: false })
  @IsString()
  @IsOptional()
  deliveryWarehouse?: string;
}