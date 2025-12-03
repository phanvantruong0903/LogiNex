import { Field, ObjectType, ID, Float, Int, OmitType } from '@nestjs/graphql';
import { Product } from '../../product/graphql/Product';

@ObjectType()
export class BinProductDetail extends OmitType(Product, [
  'hasBattery',
  'width',
  'height',
  'length',
]) {
  @Field(() => Float, { nullable: true })
  volume?: number;
}

@ObjectType()
export class BinProductItemDetail {
  @Field(() => Int)
  quantity!: number;

  @Field(() => BinProductDetail)
  product!: BinProductDetail;
}

@ObjectType()
export class BinWithProducts {
  @Field(() => ID)
  id!: string;

  @Field()
  code!: string;

  @Field(() => Float, { nullable: true })
  currWeight?: number;

  @Field(() => Float, { nullable: true })
  currVolume?: number;

  @Field()
  maxWeight!: number;

  @Field()
  maxVolume!: number;

  @Field(() => [BinProductItemDetail], { nullable: true })
  items?: BinProductItemDetail[];
}
