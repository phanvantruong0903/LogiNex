import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { CreateUserInput } from '../../auth';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['password', 'email'] as const),
) {}
