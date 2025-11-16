import { Module } from '@nestjs/common';
import { AuthGrpcController } from './auth.grpc.controller';
import { AuthConsulRegistrar } from '../../consul/consul.service';
import {
  ConsuleModule,
  ConsulService,
  CONSULT_SERVICE_ID,
  GRPC_PACKAGE,
  JwtSharedModule,
} from '@mebike/common';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';

@Module({
  imports: [
    ConsuleModule,
    JwtSharedModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: GRPC_PACKAGE.USER,
        imports: [ConsuleModule],
        inject: [ConsulService],
        useFactory: async (consulService: ConsulService) => {
          const userService = await consulService.discoverService(
            CONSULT_SERVICE_ID.USER,
          );
          return {
            transport: Transport.GRPC,
            options: {
              package: 'user',
              protoPath: join(
                __dirname,
                '..',
                '..',
                '..',
                'common/src/lib/proto/user.proto',
              ),
              url: `${userService.address}:${userService.port}`,
            },
          };
        },
      },
    ]),
  ],
  controllers: [AuthGrpcController],
  providers: [AuthService, AuthConsulRegistrar],
})
export class AuthModule {}
