/*
  Warnings:

  - You are about to drop the `attendance_grades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grade_configurations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."attendance_grades" DROP CONSTRAINT "attendance_grades_userId_fkey";

-- DropTable
DROP TABLE "public"."attendance_grades";

-- DropTable
DROP TABLE "public"."grade_configurations";

-- DropEnum
DROP TYPE "public"."GradeLevel";
