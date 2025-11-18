import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  GRAPHQL_NAME,
  Role,
  UpdateUserInput,
  UserListResponse,
  UserProfile,
  UserResponse,
} from '@mebike/common';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/role.decorator';
import { RoleGuard } from '../auth/role.guard';

import { GetUsersInput } from './graphql/GetUserInput';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserListResponse, { name: GRAPHQL_NAME.GET_ALL })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER)
  async getAllUser(
    @Args('params', {
      nullable: true,
      type: () => GetUsersInput,
      defaultValue: {},
    })
    data?: GetUsersInput,
  ): Promise<UserListResponse> {
    const page = data?.page ?? 1;
    const limit = data?.limit ?? 10;

    return this.userService.getAllUser({ page, limit });
  }

  @Query(() => UserResponse, { name: GRAPHQL_NAME.GET_ONE })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getUserDetail(@Args('params') id: string): Promise<UserResponse> {
    return this.userService.getUserDetail(id);
  }

  @Mutation(() => UserResponse, { name: GRAPHQL_NAME.UPDATE })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @CurrentUser() user: UserProfile,
    @Args('data') data: UpdateUserInput,
  ): Promise<UserResponse> {
    const id = user?.id;
    return this.userService.updateUser(id, data);
  }

  @Mutation(() => UserResponse, { name: GRAPHQL_NAME.CHANGE_PASSWORD })
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: UserProfile,
    @Args('password') password: string,
  ): Promise<UserResponse> {
    const id = user?.id;
    return this.userService.changePassword(id, password);
  }

  @Query(() => String)
  _healthCheck(): string {
    return 'API is running';
  }
}
