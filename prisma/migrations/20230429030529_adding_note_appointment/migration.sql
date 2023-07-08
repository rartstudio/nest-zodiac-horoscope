/*
  Warnings:

  - Added the required column `note` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "note" TEXT NOT NULL;
