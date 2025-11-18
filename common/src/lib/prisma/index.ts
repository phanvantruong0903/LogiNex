import * as AuthPrismaInternal from './auth/generated';
import * as UserPrismaInternal from './user/generated';

export * as AuthPrisma from './auth/generated';
export * as UserPrisma from './user/generated';

export const prismaAuth = new AuthPrismaInternal.PrismaClient();
export const prismaUser = new UserPrismaInternal.PrismaClient();

export type User = AuthPrismaInternal.User; // Cho auth models
export type Profile = UserPrismaInternal.Profile; // Cho user models, thêm nếu cần
