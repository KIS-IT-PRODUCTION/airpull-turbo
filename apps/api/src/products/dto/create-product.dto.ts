import { ApiProperty } from '@nestjs/swagger';

export class CreateProductImageDto {
  @ApiProperty() url: string;
  @ApiProperty({ required: false }) alt?: string;
  @ApiProperty({ default: 0 }) order?: number;
}

export class CreateProductSpecDto {
  @ApiProperty() key: string;
  @ApiProperty() value: string;
  @ApiProperty({ default: 0 }) order?: number;
}

export class CreateProductDto {
  @ApiProperty() name: string;
  @ApiProperty({ required: false }) description?: string;
  @ApiProperty() price: number;
  @ApiProperty() stock: number;
  @ApiProperty({ required: false }) imageUrl?: string;
  @ApiProperty({ type: [CreateProductImageDto], required: false })
  images?: CreateProductImageDto[];
  @ApiProperty({ type: [CreateProductSpecDto], required: false })
  specifications?: CreateProductSpecDto[];
}