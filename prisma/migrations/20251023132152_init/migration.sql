/*
  Warnings:

  - The `verify` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserVerifyStatus" AS ENUM ('Unverified', 'Verified', 'Banned');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'STAFF');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
DROP COLUMN "verify",
ADD COLUMN     "verify" "UserVerifyStatus" NOT NULL DEFAULT 'Unverified';
