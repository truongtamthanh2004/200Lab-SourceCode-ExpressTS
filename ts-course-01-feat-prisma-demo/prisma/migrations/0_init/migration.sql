-- CreateTable
CREATE TABLE `brands` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `image` VARCHAR(200) NULL,
    `tag_line` VARCHAR(150) NULL,
    `description` TEXT NULL,
    `status` ENUM('active', 'inactive', 'deleted') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carts` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `product_id` VARCHAR(36) NOT NULL,
    `attribute` VARCHAR(150) NOT NULL,
    `quantity` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `upa`(`user_id`, `product_id`, `attribute`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `image` VARCHAR(200) NULL,
    `description` VARCHAR(50) NULL,
    `position` INTEGER NULL DEFAULT 0,
    `parent_id` VARCHAR(36) NULL,
    `status` ENUM('active', 'inactive', 'deleted') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `id` VARCHAR(36) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `cloud_name` VARCHAR(50) NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `size` INTEGER NULL,
    `status` ENUM('uploaded', 'used') NULL DEFAULT 'uploaded',
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` VARCHAR(36) NOT NULL,
    `order_id` VARCHAR(36) NOT NULL,
    `product_id` VARCHAR(36) NOT NULL,
    `attribute` VARCHAR(80) NOT NULL,
    `image` VARCHAR(200) NULL,
    `name` VARCHAR(150) NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(15, 2) NOT NULL,

    INDEX `product_id`(`product_id`),
    UNIQUE INDEX `opa`(`order_id`, `product_id`, `attribute`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `shipping_address` VARCHAR(255) NOT NULL,
    `shipping_city` VARCHAR(80) NULL,
    `shipping_method` ENUM('free', 'standard') NULL DEFAULT 'free',
    `payment_method` ENUM('cod', 'zalo') NULL,
    `payment_status` ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
    `recipient_first_name` VARCHAR(80) NULL,
    `recipient_last_name` VARCHAR(80) NULL,
    `recipient_phone` VARCHAR(50) NULL,
    `recipient_email` VARCHAR(50) NULL,
    `tracking_number` VARCHAR(15) NULL,
    `status` ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed', 'canceled', 'refunded', 'deleted') NULL DEFAULT 'pending',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `tracking_number`(`tracking_number`),
    INDEX `payment_status`(`payment_status`),
    INDEX `status`(`status`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_likes` (
    `user_id` VARCHAR(36) NOT NULL,
    `product_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(6) NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`product_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_ratings` (
    `user_id` VARCHAR(36) NOT NULL,
    `product_id` VARCHAR(36) NOT NULL,
    `content` TEXT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`product_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `gender` ENUM('male', 'femail', 'unisex') NULL DEFAULT 'unisex',
    `images` JSON NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `sale_price` DECIMAL(15, 2) NOT NULL,
    `colors` VARCHAR(100) NULL,
    `quantity` INTEGER NOT NULL,
    `brand_id` VARCHAR(36) NOT NULL,
    `category_id` VARCHAR(36) NOT NULL,
    `content` TEXT NULL,
    `description` TEXT NULL,
    `rating` FLOAT NULL DEFAULT 0,
    `sale_count` INTEGER UNSIGNED NULL DEFAULT 0,
    `status` ENUM('active', 'inactive', 'deleted') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `brand_id`(`brand_id`),
    INDEX `category_id`(`category_id`),
    INDEX `gender`(`gender`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_identities` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `identifier` VARCHAR(150) NULL,
    `password` VARCHAR(100) NULL,
    `salt` VARCHAR(50) NULL,
    `type` ENUM('email_password', 'facebook', 'google') NOT NULL DEFAULT 'email_password',
    `status` ENUM('active', 'pending', 'inactive', 'banned', 'deleted') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `identity_id` VARCHAR(36) NOT NULL,
    `expired_at` TIMESTAMP(0) NULL,
    `ip` VARCHAR(15) NULL,
    `geo` VARCHAR(100) NULL,
    `device` VARCHAR(150) NULL,
    `type` ENUM('access_token', 'refresh') NOT NULL DEFAULT 'access_token',
    `status` ENUM('active', 'pending', 'inactive', 'banned', 'deleted') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL,
    `avatar` VARCHAR(150) NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `salt` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `address` VARCHAR(255) NULL,
    `birthday` DATE NULL,
    `gender` ENUM('male', 'female', 'unknown') NOT NULL DEFAULT 'male',
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `status` ENUM('active', 'pending', 'inactive', 'banned', 'deleted') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

