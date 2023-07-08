/*
  Warnings:

  - The primary key for the `RolesOnModules` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "RolesOnModules" DROP CONSTRAINT "RolesOnModules_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RolesOnModules_pkey" PRIMARY KEY ("id");
