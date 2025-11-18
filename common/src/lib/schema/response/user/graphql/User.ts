import { Field, ID, ObjectType } from '@nestjs/graphql';

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
  role!: string;

  @Field()
  verify!: string;
}
