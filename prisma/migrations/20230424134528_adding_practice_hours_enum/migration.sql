/*
  Warnings:

  - Added the required column `status` to the `PracticeHour` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PracticeHourStatus" AS ENUM ('CANCEL', 'PUBLISH', 'DRAFT');

-- AlterTable
ALTER TABLE "PracticeHour" ADD COLUMN     "status" "PracticeHourStatus" NOT NULL;
