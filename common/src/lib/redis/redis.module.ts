import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { REDIS_CONSTANTS } from '../constants/redis';
import { Redis } from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CONSTANTS.REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>(REDIS_CONSTANTS.REDIS_HOST),
          port: configService.get<number>(REDIS_CONSTANTS.REDIS_PORT),
          password: configService.get<string>(REDIS_CONSTANTS.REDIS_PASSWORD),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CONSTANTS.REDIS_CLIENT],
})
export class RedisModule {}
