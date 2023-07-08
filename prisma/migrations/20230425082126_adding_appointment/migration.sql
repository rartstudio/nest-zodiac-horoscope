/*
  Warnings:

  - The primary key for the `PracticeHour` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[practiceHourId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `practiceHourId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `PracticeHour` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "practiceHourId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PracticeHour" DROP CONSTRAINT "PracticeHour_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "PracticeHour_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_practiceHourId_key" ON "Appointment"("practiceHourId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_practiceHourId_fkey" FOREIGN KEY ("practiceHourId") REFERENCES "PracticeHour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
