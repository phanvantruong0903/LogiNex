import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ZoneType } from './CreateZoneDto';

export class UpdateZoneDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ZoneType)
  @IsOptional()
  type?: ZoneType;
}
