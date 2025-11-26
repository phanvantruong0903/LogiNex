import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from 'src/lib/schema/request';

@InputType()
export class LoginInput extends PartialType(
  OmitType(CreateUserInput, ['YOB', 'name'] as const),
) {}
