/*
  Warnings:

  - Added the required column `Avatar` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "Avatar" TEXT NOT NULL;
