/*
  Warnings:

  - Added the required column `reportedId` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "reportedId" INTEGER NOT NULL;
