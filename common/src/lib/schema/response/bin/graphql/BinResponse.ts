import { ObjectType } from '@nestjs/graphql';
import { ApiResponseType } from '../../../../graphql/api-response.type';
import { Bin } from './Bin';
import { BinLayout } from './BinLayout';
import { BinWithProducts } from './BinProductResponse';

@ObjectType()
export class BinResponse extends ApiResponseType(Bin) {}

@ObjectType()
export class BinListResponse extends ApiResponseType(Bin, {
  isArray: true,
}) {}

@ObjectType()
export class BinProductResponse extends ApiResponseType(BinWithProducts) {}
