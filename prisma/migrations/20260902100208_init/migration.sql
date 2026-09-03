/*
  Warnings:

  - The primary key for the `task_table` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `email` to the `task_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task_table` DROP PRIMARY KEY,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`title`, `email`);
