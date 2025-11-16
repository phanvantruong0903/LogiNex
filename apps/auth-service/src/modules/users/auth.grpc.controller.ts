import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  BaseGrpcHandler,
  SERVER_MESSAGE,
  throwGrpcError,
  GRPC_SERVICES,
  USER_METHODS,
  grpcResponse,
  USER_MESSAGES,
  UserDto,
  CreateProfileDto,
} from '@mebike/common';
import { LoginUserDto } from '@mebike/common';
import * as bcrypt from 'bcrypt';
import { User } from '@mebike/prisma-auth-client';
import { CreateUserDto } from '@mebike/common';
import { prisma } from '../../config/prisma';

@Controller()
export class AuthGrpcController {
  private readonly baseHandler: BaseGrpcHandler<User, UserDto, never>;

  constructor(private readonly authService: AuthService) {
    this.baseHandler = new BaseGrpcHandler(this.authService, UserDto);
  }

  @GrpcMethod(GRPC_SERVICES.AUTH, USER_METHODS.CREATE)
  async createUser(data: CreateUserDto) {
    let user: User | null = null;
    try {
      // Step 1 : Create User Account Record
      const hashPassword = bcrypt.hashSync(data.password, 10);

      const userData: UserDto = {
        email: data.email,
        password: hashPassword,
      };

      user = await this.baseHandler.createLogic(userData);

      // Step 2 : Create User Profile Record
      const profileData: CreateProfileDto = {
        YOB: data.YOB,
        name: data.name,
        accountId: user.id,
      };
      await this.createProfile(profileData);

      return grpcResponse(user, USER_MESSAGES.CREATE_SCUCCESS);
    } catch (error) {
      const err = error as Error;

      // Rollback User Account Creation
      if (user) {
        try {
          await prisma.user.delete({ where: { id: user.id } });
        } catch (rollbackError) {
          const error = rollbackError as Error;
          throwGrpcError(error.message, [error.message]);
        }
      }

      throwGrpcError(err?.message || USER_MESSAGES.CREATE_FAILED, [
        err.message,
      ]);
    }
  }

  @GrpcMethod(GRPC_SERVICES.AUTH, USER_METHODS.LOGIN)
  async login(data: LoginUserDto) {
    const result = await this.authService.validateUser(data);

    const { accessToken, refreshToken } = await this.authService.generateToken(
      result,
    );

    return grpcResponse(
      { accessToken, refreshToken },
      USER_MESSAGES.LOGIN_SUCCESS,
    );
  }

  @GrpcMethod(GRPC_SERVICES.AUTH, USER_METHODS.REFRESH_TOKEN)
  async refreshToken(data: { refreshToken: string }) {
    const { refreshToken } = data;

    if (!refreshToken) {
      throwGrpcError(SERVER_MESSAGE.BAD_REQUEST, [
        USER_MESSAGES.REFRESH_TOKEN_REQUIRED,
      ]);
    }

    const result = await this.authService.refreshToken(refreshToken);
    return grpcResponse(result, USER_MESSAGES.REFRESH_TOKEN_SUCCESSFULLY);
  }

  async createProfile(data: CreateProfileDto) {
    try {
      const profile = await this.authService.createProfile(data);
      return profile;
    } catch (error) {
      const err = error as Error;
      throw new RpcException(err?.message);
    }
  }
}
