import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../auth/CreateUserDto';
import { IsString, IsNotEmpty } from 'class-validator';

const PickedUserFields = PickType(CreateUserDto, ['YOB', 'name']);

export class CreateProfileDto extends PickedUserFields {
  @IsString()
  @IsNotEmpty()
  accountId!: string;
}
