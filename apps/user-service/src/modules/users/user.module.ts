import { Module } from '@nestjs/common';
import { UserService } from './user.services';
import { UserController } from './user.controllers';
import { UserConsulRegistrar } from '../../consul/consul.service';
import { ConsuleModule } from '@mebike/common';

@Module({
  imports: [ConsuleModule],
  providers: [UserService, UserConsulRegistrar],
  controllers: [UserController],
})
export class UserModule {}
