import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserResponse, UserListResponse } from '../auth/graphql/UserResponse';
import { GRAPHQL_NAME } from '@mebike/common';
import { UserService } from './user.service';
import { UpdateUserInput } from '../auth/graphql/UpdateUserInput';
import { GetUsersInput } from './graphql/GetUserInput';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserListResponse, { name: GRAPHQL_NAME.GET_ALL })
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
  async getUserDetail(@Args('params') id: string): Promise<UserResponse> {
    return this.userService.getUserDetail(id);
  }

  @Mutation(() => UserResponse, { name: GRAPHQL_NAME.UPDATE })
  async updateUser(
    @Args('params') id: string,
    @Args('data') data: UpdateUserInput,
  ): Promise<UserResponse> {
    return this.userService.updateUser(id, data);
  }

  @Mutation(() => UserResponse, { name: GRAPHQL_NAME.CHANGE_PASSWORD })
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
