import { PaginationInput } from '@mebike/common';
import { InputType } from '@nestjs/graphql';

@InputType()
export class GetUsersInput extends PaginationInput {}
