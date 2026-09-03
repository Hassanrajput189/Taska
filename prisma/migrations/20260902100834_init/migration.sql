/*
  Warnings:

  - The primary key for the `task_table` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `task_table` table. All the data in the column will be lost.
  - Added the required column `admin_email` to the `task_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task_table` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    ADD COLUMN `admin_email` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`title`, `assign`);
