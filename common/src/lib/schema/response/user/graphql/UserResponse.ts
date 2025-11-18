import { ObjectType } from '@nestjs/graphql';
import { UserProfile } from './User';
import { ApiResponseType } from '../../../../graphql/api-response.type';

@ObjectType()
export class UserResponse extends ApiResponseType(UserProfile) {}

@ObjectType()
export class UserListResponse extends ApiResponseType(UserProfile, {
  isArray: true,
}) {}
