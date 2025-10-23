import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserResponse, UserListResponse } from '../auth/graphql/UserResponse';
import { GRAPHQL_NAME, Role } from '@mebike/common';
import { UserService } from './user.service';
import { UpdateUserInput } from '../auth/graphql/UpdateUserInput';
import { GetUsersInput } from './graphql/GetUserInput';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/role.decorator';
import { RoleGuard } from '../auth/role.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserListResponse, { name: GRAPHQL_NAME.GET_ALL })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(JwtAuthGuard)
  async getUserDetail(@Args('params') id: string): Promise<UserResponse> {
    return this.userService.getUserDetail(id);
  }

  @Mutation(() => UserResponse, { name: GRAPHQL_NAME.UPDATE })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('params') id: string,
    @Args('data') data: UpdateUserInput,
  ): Promise<UserResponse> {
    return this.userService.updateUser(id, data);
  }

  @Mutation(() => UserResponse, { name: GRAPHQL_NAME.CHANGE_PASSWORD })
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Args('params') id: string,
    @Args('password') password: string,
  ): Promise<UserResponse> {
    return this.userService.changePassword(id, password);
  }

  @Query(() => String)
  _healthCheck(): string {
    return 'API is running';
  }
}
