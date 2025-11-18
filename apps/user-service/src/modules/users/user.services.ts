import { Injectable } from '@nestjs/common';
import {
  BaseService,
  CreateProfileDto,
  UpdateProfileDto,
} from '@mebike/common';
import { Profile } from '@mebike/prisma-user-client';
import { prisma } from '../../config/prisma';

@Injectable()
export class UserService extends BaseService<
  Profile,
  CreateProfileDto,
  UpdateProfileDto
> {
  constructor() {
    super(prisma.profile);
  }
}
