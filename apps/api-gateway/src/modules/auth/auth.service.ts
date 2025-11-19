import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import {
  CreateUserDto,
  RegisterResponse,
  LoginResponse,
  ResfreshTokenResponse,
  GRPC_PACKAGE,
  GRPC_SERVICES,
  LoginInput,
} from '@mebike/common';

interface AuthServiceClient {
  LoginUser(data: LoginInput): Observable<LoginResponse>;
  CreateUser(data: CreateUserDto): Observable<RegisterResponse>;
  RefreshToken(refreshToken: object): Observable<ResfreshTokenResponse>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private userService!: AuthServiceClient;

  constructor(@Inject(GRPC_PACKAGE.AUTH) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<AuthServiceClient>(
      GRPC_SERVICES.AUTH,
    );
  }

  async login(data: LoginInput) {
    return await lastValueFrom(this.userService.LoginUser(data));
  }

  async register(data: CreateUserDto) {
    return await lastValueFrom(this.userService.CreateUser(data));
  }

  async refreshToken(refreshToken: string) {
    return await lastValueFrom(this.userService.RefreshToken({ refreshToken }));
  }
}
