/*
  Warnings:

  - You are about to drop the column `patientId` on the `MedicalRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appointmentId]` on the table `MedicalRecord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentId` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- AlterTable
ALTER TABLE "MedicalRecord" DROP COLUMN "patientId",
ADD COLUMN     "appointmentId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_appointmentId_key" ON "MedicalRecord"("appointmentId");

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
