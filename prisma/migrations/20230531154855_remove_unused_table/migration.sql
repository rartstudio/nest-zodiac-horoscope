/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppointmentHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Module` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PracticeHour` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolesOnModules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersOnRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_practiceHourId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentHistory" DROP CONSTRAINT "AppointmentHistory_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_userId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_userId_fkey";

-- DropForeignKey
ALTER TABLE "PracticeHour" DROP CONSTRAINT "PracticeHour_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "RolesOnModules" DROP CONSTRAINT "RolesOnModules_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "RolesOnModules" DROP CONSTRAINT "RolesOnModules_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnRoles" DROP CONSTRAINT "UsersOnRoles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnRoles" DROP CONSTRAINT "UsersOnRoles_userId_fkey";

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "AppointmentHistory";

-- DropTable
DROP TABLE "Doctor";

-- DropTable
DROP TABLE "MedicalRecord";

-- DropTable
DROP TABLE "Module";

-- DropTable
DROP TABLE "Patient";

-- DropTable
DROP TABLE "PracticeHour";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RolesOnModules";

-- DropTable
DROP TABLE "UsersOnRoles";

-- DropEnum
DROP TYPE "AppointmentStatus";

-- DropEnum
DROP TYPE "DoctorStatus";

-- DropEnum
DROP TYPE "PatientStatus";

-- DropEnum
DROP TYPE "Permission";

-- DropEnum
DROP TYPE "PracticeHourStatus";
