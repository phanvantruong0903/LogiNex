import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  BaseService,
  GRPC_PACKAGE,
  GRPC_SERVICES,
  JwtServiceCustom,
  SERVER_MESSAGE,
  TokenPayload,
  USER_MESSAGES,
  UserProfile,
  UserResponse,
  throwGrpcError,
} from '@mebike/common';
import { LoginUserDto } from '@mebike/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import { prisma } from '../../config/prisma';
import { User } from '@mebike/prisma-auth-client';
import { CreateUserDto } from '@mebike/common';
import { CreateProfileDto } from '@mebike/common';
import { firstValueFrom, Observable } from 'rxjs';

interface UserServiceClient {
  CreateProfile(data: {
    name: string;
    YOB: number;
    accountId: string;
  }): Observable<UserResponse>;
  GetUser(data: { id: string }): Observable<UserResponse>;
}
@Injectable()
export class AuthService
  extends BaseService<User, CreateUserDto, never>
  implements OnModuleInit
{
  private userService!: UserServiceClient;

  constructor(
    private readonly jwtService: JwtServiceCustom,
    @Inject(GRPC_PACKAGE.USER) private readonly client: ClientGrpc,
  ) {
    super(prisma.user);
  }

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>(
      GRPC_SERVICES.USER,
    );
  }

  async validateUser(data: LoginUserDto) {
    if (data) {
      const dtoInstance = plainToInstance(LoginUserDto, data);
      try {
        await validateOrReject(dtoInstance);
        const findUser = await prisma.user.findUnique({
          where: { email: dtoInstance.email },
        });
        if (!findUser) {
          throwGrpcError(SERVER_MESSAGE.NOT_FOUND, [USER_MESSAGES.NOT_FOUND]);
        }

        const isMatch = await bcrypt.compare(
          dtoInstance.password,
          findUser?.password,
        );

        if (!isMatch) {
          throwGrpcError(SERVER_MESSAGE.NOT_FOUND, [
            USER_MESSAGES.VALIDATION_FAILED,
          ]);
        }

        const userProfile = await this.getUserProfile(findUser.id);
        const userData = userProfile.data as UserProfile;

        console.log(userData);

        return {
          user_id: findUser.id,
          verify: userData.verify,
          role: userData.role,
        };
      } catch (error: unknown) {
        if (error instanceof RpcException) {
          throw error;
        }
        const err = error as Error;
        throwGrpcError(SERVER_MESSAGE.INTERNAL_SERVER, [err?.message]);
      }
    } else {
      throwGrpcError(SERVER_MESSAGE.BAD_REQUEST, [USER_MESSAGES.INVALID_DATA]);
    }
  }

  async createUserProfile(payload: CreateProfileDto) {
    return await firstValueFrom(this.userService.CreateProfile(payload));
  }

  async getUserById(id: string) {
    return await firstValueFrom(this.userService.GetUser({ id }));
  }

  async generateToken(payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAcessToken(payload),
      this.signRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyToken(refreshToken);
      if (!decoded) {
        throwGrpcError(SERVER_MESSAGE.UNAUTHORIZED, [
          USER_MESSAGES.INVALID_REFRESH_TOKEN,
        ]);
      }

      const { user_id, verify, role } = decoded as TokenPayload;
      if (!user_id) {
        throwGrpcError(SERVER_MESSAGE.UNAUTHORIZED, [
          USER_MESSAGES.INVALID_TOKEN_PAYLOAD,
        ]);
      }

      const findUser = await prisma.user.findUnique({ where: { id: user_id } });
      if (!findUser) {
        throwGrpcError(SERVER_MESSAGE.NOT_FOUND, [USER_MESSAGES.NOT_FOUND]);
      }

      const accessToken = await this.jwtService.signToken({
        user_id,
        verify,
        role,
      });
      return { accessToken };
    } catch (error: unknown) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throwGrpcError(SERVER_MESSAGE.INTERNAL_SERVER, [err?.message]);
    }
  }

  private async signAcessToken(payload: TokenPayload) {
    return this.jwtService.signToken(payload);
  }

  private async signRefreshToken(payload: TokenPayload, exp?: number) {
    return this.jwtService.signToken(payload, { expiresIn: exp ?? '7d' });
  }

  async decodeToken(token: string) {
    return this.jwtService.decodeToken(token);
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyToken(token);
  }

  async createProfile(data: CreateProfileDto) {
    if (data) {
      const dtoInstance = plainToInstance(CreateProfileDto, data);
      try {
        await validateOrReject(dtoInstance);
        const profile = await this.createUserProfile({
          name: data.name,
          accountId: data.accountId,
          YOB: data.YOB,
        });

        return profile;
      } catch (error) {
        const err = error as Error;
        throwGrpcError(SERVER_MESSAGE.INTERNAL_SERVER, [err?.message]);
      }
    } else {
      throwGrpcError(SERVER_MESSAGE.BAD_REQUEST, [USER_MESSAGES.INVALID_DATA]);
    }
  }

  async getUserProfile(id: string): Promise<UserResponse> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throwGrpcError(SERVER_MESSAGE.NOT_FOUND, [USER_MESSAGES.NOT_FOUND]);
      }

      return user;
    } catch (error) {
      const err = error as Error;
      throwGrpcError(SERVER_MESSAGE.INTERNAL_SERVER, [err?.message]);
    }
  }
}
