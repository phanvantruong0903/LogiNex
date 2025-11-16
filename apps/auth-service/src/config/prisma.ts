// eslint-disable-next-line @nx/enforce-module-boundaries
import { PrismaClient } from '../../generated/prisma-client-auth-service';

export const prisma = new PrismaClient();
