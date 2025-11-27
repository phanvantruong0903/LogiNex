import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  BaseGrpcHandler,
  CreateProfileDto,
  GRPC_SERVICES,
  grpcResponse,
  throwGrpcError,
  USER_MESSAGES,
  USER_METHODS,
  UpdateProfileDto,
  prismaUser,
  Profile,
  grpcPaginateResponse,
  UserProfile,
} from '@loginex/common';
import { UserService } from './user.services';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UserController {
  private readonly baseHandler: BaseGrpcHandler<
    Profile,
    CreateProfileDto,
    UpdateProfileDto
  >;

  constructor(private readonly userService: UserService) {
    this.baseHandler = new BaseGrpcHandler(
      this.userService,
      CreateProfileDto,
      UpdateProfileDto,
    );
  }

  @GrpcMethod(GRPC_SERVICES.USER, USER_METHODS.UPDATE)
  async updateProfile(
    data: UpdateProfileDto & { id: string },
  ): Promise<ReturnType<typeof grpcResponse>> {
    try {
      const { id, ...updateData } = data;

      const findUser = await prismaUser.profile.findUnique({
        where: { accountId: id },
        select: {
          id: true,
        },
      });
      if (!findUser) {
        throwGrpcError(USER_MESSAGES.NOT_FOUND, [USER_MESSAGES.NOT_FOUND]);
      }

      const result = await this.baseHandler.updateLogic(
        findUser.id,
        updateData,
      );
      return grpcResponse<UserProfile>(result, USER_MESSAGES.UPDATE_SUCCESS);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || USER_MESSAGES.UPDATE_FAIL);
    }
  }

  @GrpcMethod(GRPC_SERVICES.USER, USER_METHODS.GET_ONE)
  async getUserDetail({
    id,
  }: {
    id: string;
  }): Promise<ReturnType<typeof grpcResponse>> {
    try {
      const result = await prismaUser.profile.findUnique({
        where: { accountId: id },
      });
      if (!result) {
        throwGrpcError(USER_MESSAGES.NOT_FOUND, [USER_MESSAGES.NOT_FOUND]);
      }

      return grpcResponse<UserProfile>(
        result,
        USER_MESSAGES.GET_DETAIL_SUCCESS,
      );
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || USER_MESSAGES.UPDATE_FAIL);
    }
  }

  @GrpcMethod(GRPC_SERVICES.USER, USER_METHODS.CREATE_PROFILE)
  async createProfile(
    data: CreateProfileDto,
  ): Promise<ReturnType<typeof grpcResponse>> {
    try {
      const profile = await this.baseHandler.createLogic(data);
      return grpcResponse<UserProfile>(profile, USER_MESSAGES.CREATE_SCUCCESS);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || USER_MESSAGES.CREATE_FAILED);
    }
  }

  @GrpcMethod(GRPC_SERVICES.USER, USER_METHODS.GET_ALL)
  async getAllUsers(data: {
    page: number;
    limit: number;
  }): Promise<ReturnType<typeof grpcPaginateResponse>> {
    try {
      const { page, limit } = data;
      const result = await this.baseHandler.getAllLogic(page, limit);
      return grpcPaginateResponse(result, USER_MESSAGES.GET_ALL_SUCCESS);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || USER_MESSAGES.GET_ALL_FAILED);
    }
  }
}
