import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum ZoneType {
  STANDARD = 'STANDARD',
  SECURE = 'SECURE',
  HAZARD = 'HAZARD',
}

export class CreateZoneDto {
  @IsString()
  @IsNotEmpty()
  wareHouseId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(ZoneType)
  @IsNotEmpty()
  type!: ZoneType;
}
