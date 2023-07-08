/*
  Warnings:

  - Added the required column `status` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DoctorStatus" AS ENUM ('AVAILABLE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "status" "DoctorStatus" NOT NULL;
