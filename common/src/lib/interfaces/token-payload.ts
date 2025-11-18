import { Role, UserVerifyStatus } from '@mebike/prisma-user-client';

export interface TokenPayload {
  user_id: string;
  verify: UserVerifyStatus;
  role: Role;
}
