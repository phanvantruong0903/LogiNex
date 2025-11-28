import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
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
  LoginUserDto,
  CreateUserDto,
  prismaAuth,
  User,
  ChangePasswordDto,
} from '@loginex/common';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthGrpcController {
  private readonly baseHandler: BaseGrpcHandler<User, UserDto, never>;

  constructor(private readonly authService: AuthService) {
    this.baseHandler = new BaseGrpcHandler(this.authService, UserDto);
  }

  @GrpcMethod(GRPC_SERVICES.AUTH, USER_METHODS.CREATE)
  async createUser(
    data: CreateUserDto,
  ): Promise<ReturnType<typeof grpcResponse>> {
    let user: User | null = null;
    try {
      // Step 1 : Create User Account Record
      const hashPassword = await bcrypt.hash(data.password, 10);

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
      // Rollback User Account Creation
      if (user) {
        try {
          await prismaAuth.user.delete({ where: { id: user.id } });
        } catch (rollbackError) {
          const error = rollbackError as Error;
          throwGrpcError(error.message, [error.message]);
        }
      }

      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;

      throwGrpcError(err?.message || USER_MESSAGES.CREATE_FAILED, [
        err.message,
      ]);
    }
  }

  @GrpcMethod(GRPC_SERVICES.AUTH, USER_METHODS.LOGIN)
  async login(data: LoginUserDto): Promise<ReturnType<typeof grpcResponse>> {
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
  async refreshToken(data: {
    refreshToken: string;
  }): Promise<ReturnType<typeof grpcResponse>> {
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
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message);
    }
  }

  @GrpcMethod(GRPC_SERVICES.AUTH, USER_METHODS.CHANGE_PASSWORD)
  async changePassword(data: ChangePasswordDto) {
    try {
      const user = await this.authService.changePassword(data);
      return grpcResponse(user, USER_MESSAGES.CHANGE_PASSWORD_SUCCESS);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message);
    }
  }
}
