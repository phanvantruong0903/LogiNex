import { PaginationInput } from '@loginex/common';
import { InputType } from '@nestjs/graphql';

@InputType()
export class GetUsersInput extends PaginationInput {}
