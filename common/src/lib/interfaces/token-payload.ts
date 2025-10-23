import { Role, UserVerifyStatus } from '@prisma/client';

export interface TokenPayload {
  user_id: string;
  verify: UserVerifyStatus;
  role: Role;
}
