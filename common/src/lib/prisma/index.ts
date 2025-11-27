import * as AuthPrismaInternal from './auth/generated';
import * as UserPrismaInternal from './user/generated';
import * as InventoryPrismaInternal from './inventory/generated';

export * as AuthPrisma from './auth/generated';
export * as UserPrisma from './user/generated';
export * as InventoryPrisma from './inventory/generated';

export const prismaAuth = new AuthPrismaInternal.PrismaClient();
export const prismaUser = new UserPrismaInternal.PrismaClient();
export const prismaInventory = new InventoryPrismaInternal.PrismaClient();

export type User = AuthPrismaInternal.User;
export type Profile = UserPrismaInternal.Profile;
export type Product = InventoryPrismaInternal.Product;
export type Rack = InventoryPrismaInternal.Rack;
export type WareHouse = InventoryPrismaInternal.WareHouse;
export type Zone = InventoryPrismaInternal.Zone;
export { Role, UserVerifyStatus } from './user/generated';
export { ZoneType } from './inventory/generated';
