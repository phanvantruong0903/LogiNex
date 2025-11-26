import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { CreateUserInput } from 'src/lib/schema/request/user/graphql/CreateUserDto';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['password', 'email'] as const),
) {}
