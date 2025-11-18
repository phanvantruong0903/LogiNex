import * as AuthPrismaInternal from './auth/generated';
import * as UserPrismaInternal from './user/generated';

export * as AuthPrisma from './auth/generated';
export * as UserPrisma from './user/generated';

export const prismaAuth = new AuthPrismaInternal.PrismaClient();
export const prismaUser = new UserPrismaInternal.PrismaClient();

export type User = AuthPrismaInternal.User;
export type Profile = UserPrismaInternal.Profile;
export type { Role, UserVerifyStatus } from './user/generated';
