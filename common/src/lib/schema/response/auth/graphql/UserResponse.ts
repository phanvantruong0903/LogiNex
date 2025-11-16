import { ObjectType } from '@nestjs/graphql';
import { UserProfile } from './User';
import { AuthPayload } from './AuthPayload';
import { RefreshToken } from './RefreshToken';
import { ApiResponseType } from '../../../../graphql/api-response.type';

@ObjectType()
export class UserResponse extends ApiResponseType(UserProfile) {}

@ObjectType()
export class LoginResponse extends ApiResponseType(AuthPayload) {}

@ObjectType()
export class UserListResponse extends ApiResponseType(UserProfile, {
  isArray: true,
}) {}

@ObjectType()
export class ResfreshTokenResponse extends ApiResponseType(RefreshToken) {}
