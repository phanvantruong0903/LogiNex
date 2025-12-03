import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateBinDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsNumber()
  @IsOptional()
  xCoord?: number;

  @IsNumber()
  @IsOptional()
  yCoord?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(200)
  maxWeight?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(200)
  maxVolume?: number;
}
