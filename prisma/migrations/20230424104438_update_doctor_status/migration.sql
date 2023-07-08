/*
  Warnings:

  - The values [INACTIVE] on the enum `DoctorStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DoctorStatus_new" AS ENUM ('ARCHIVED', 'AVAILABLE');
ALTER TABLE "Doctor" ALTER COLUMN "status" TYPE "DoctorStatus_new" USING ("status"::text::"DoctorStatus_new");
ALTER TYPE "DoctorStatus" RENAME TO "DoctorStatus_old";
ALTER TYPE "DoctorStatus_new" RENAME TO "DoctorStatus";
DROP TYPE "DoctorStatus_old";
COMMIT;
