import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductImageDto {
  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ required: false, example: 'Вид збоку' })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateProductSpecDto {
  @ApiProperty({ example: 'Вага' })
  @IsString()
  key: string;

  @ApiProperty({ example: '500г' })
  @IsString()
  value: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Назва товару' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Опис товару...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 450 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ required: false, example: 'https://main-image.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  // НОВЕ ПОЛЕ ДЛЯ ALT ГОЛОВНОГО ЗОБРАЖЕННЯ
  @ApiProperty({ required: false, example: 'Опис головного фото для SEO' })
  @IsString()
  @IsOptional()
  imageAlt?: string;

  @ApiProperty({ required: false, example: 'liquid' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false, example: 'chaser' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ required: false, minimum: 1, maximum: 5, example: 3 })
  @IsNumber() @Min(1) @Max(5) @IsOptional()
  ice?: number;

  @ApiProperty({ required: false, minimum: 1, maximum: 5, example: 5 })
  @IsNumber() @Min(1) @Max(5) @IsOptional()
  sweet?: number;

  @ApiProperty({ required: false, minimum: 1, maximum: 5, example: 1 })
  @IsNumber() @Min(1) @Max(5) @IsOptional()
  sour?: number;

  @ApiProperty({ type: [CreateProductImageDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];

  @ApiProperty({ type: [CreateProductSpecDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductSpecDto)
  specifications?: CreateProductSpecDto[];
}