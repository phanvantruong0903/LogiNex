import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateBinDto {
  @IsString()
  @IsNotEmpty()
  rackId!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsNumber()
  @IsNotEmpty()
  xCoord!: number;

  @IsNumber()
  @IsNotEmpty()
  yCoord!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(40)
  maxWeight!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(2000)
  maxVolume!: number;
}
