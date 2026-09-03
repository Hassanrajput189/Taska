-- CreateTable
CREATE TABLE `user_table` (
    `email` VARCHAR(191) NOT NULL,
    `f_name` VARCHAR(191) NULL,
    `_role` VARCHAR(191) NULL,
    `_password` VARCHAR(191) NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task_table` (
    `title` VARCHAR(191) NOT NULL,
    `due_date` DATE NOT NULL,
    `priority` VARCHAR(191) NOT NULL,
    `_status` VARCHAR(191) NOT NULL,
    `assign` VARCHAR(191) NOT NULL,
    `_desc` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`title`, `assign`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
