/*
  Warnings:

  - Added the required column `countryCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "countryCode" VARCHAR(25) NOT NULL,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "otp" VARCHAR(25),
ADD COLUMN     "phoneNumber" VARCHAR(25) NOT NULL,
ADD COLUMN     "tokenReset" TEXT;
