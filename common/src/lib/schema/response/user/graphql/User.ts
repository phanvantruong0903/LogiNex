import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { Role, UserVerifyStatus } from 'src/lib/prisma';

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  id!: string;

  @Field()
  accountId!: string;

  @Field()
  name!: string;

  @Field()
  YOB!: number;

  @Field()
  role!: Role;

  @Field()
  verify!: UserVerifyStatus;
}
