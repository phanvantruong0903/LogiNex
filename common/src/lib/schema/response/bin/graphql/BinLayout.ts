import { Field, ObjectType, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class BinLayout {
  @Field(() => ID)
  id!: string;

  @Field()
  code!: string;

  @Field()
  xCoord!: number;

  @Field()
  yCoord!: number;

  @Field(() => Float, { nullable: true })
  currWeight?: number;

  @Field(() => Float, { nullable: true })
  currVolume?: number;

  @Field()
  maxWeight!: number;

  @Field()
  maxVolume!: number;
}

@ObjectType()
export class BinLayoutResponse {
  @Field()
  success!: boolean;

  @Field()
  message!: string;

  @Field(() => [String], { nullable: true })
  errors?: string[];

  @Field(() => [BinLayout], { nullable: true })
  data?: BinLayout[];
}
