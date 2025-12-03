import {
  IsNumber,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  sku!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(200)
  @Type(() => Number)
  width!: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(250)
  @Type(() => Number)
  height!: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(300)
  @Type(() => Number)
  length!: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(500)
  @Type(() => Number)
  weight!: number;

  @IsOptional()
  @IsBoolean()
  isFragile?: boolean;

  @IsOptional()
  @IsBoolean()
  hasBattery?: boolean;

  @IsOptional()
  @IsBoolean()
  isHighValue?: boolean;
}
