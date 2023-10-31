-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "private";

-- CreateEnum
CREATE TYPE "app"."target_platform" AS ENUM ('windows', 'macos', 'linux', 'android', 'ios', 'web', 'other');

-- CreateEnum
CREATE TYPE "private"."account_role" AS ENUM ('admin', 'user', 'beta', 'tester');

-- CreateTable
CREATE TABLE "app"."build" (
    "id" UUID NOT NULL,
    "codename" TEXT NOT NULL,
    "changelog" TEXT NOT NULL,
    "buildDate" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "build_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."target" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "platform" "app"."target_platform" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."client_data" (
    "id" UUID NOT NULL,
    "browser_properties_allow_collect" BOOLEAN NOT NULL DEFAULT true,
    "browser_properties" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."client" (
    "id" UUID NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "last_online" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "build_id" UUID NOT NULL,
    "target_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."link_build_and_target" (
    "build_id" UUID NOT NULL,
    "target_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_build_and_target_pkey" PRIMARY KEY ("build_id","target_id")
);

-- CreateTable
CREATE TABLE "private"."account" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "private"."account_role" NOT NULL DEFAULT 'user',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."billing" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "stripe_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."subscription" (
    "id" UUID NOT NULL,
    "billing_id" UUID NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."product" (
    "id" UUID NOT NULL,
    "stripe_product_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT[],
    "image_urls" TEXT[],
    "price" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "recurring_interval" TEXT NOT NULL,
    "recurring_count" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profile" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "build_id_key" ON "app"."build"("id");

-- CreateIndex
CREATE UNIQUE INDEX "build_codename_key" ON "app"."build"("codename");

-- CreateIndex
CREATE UNIQUE INDEX "build_version_key" ON "app"."build"("version");

-- CreateIndex
CREATE UNIQUE INDEX "target_id_key" ON "app"."target"("id");

-- CreateIndex
CREATE UNIQUE INDEX "target_name_key" ON "app"."target"("name");

-- CreateIndex
CREATE UNIQUE INDEX "client_data_id_key" ON "app"."client_data"("id");

-- CreateIndex
CREATE UNIQUE INDEX "client_id_key" ON "app"."client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_id_key" ON "private"."account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "private"."account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_phone_key" ON "private"."account"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "billing_id_key" ON "private"."billing"("id");

-- CreateIndex
CREATE UNIQUE INDEX "billing_account_id_key" ON "private"."billing"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "billing_stripe_id_key" ON "private"."billing"("stripe_id");

-- CreateIndex
CREATE INDEX "billing_account_id_stripe_id_idx" ON "private"."billing"("account_id", "stripe_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_id_key" ON "private"."subscription"("id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_billing_id_key" ON "private"."subscription"("billing_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripe_subscription_id_key" ON "private"."subscription"("stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_product_id_key" ON "private"."subscription"("product_id");

-- CreateIndex
CREATE INDEX "subscription_billing_id_stripe_subscription_id_idx" ON "private"."subscription"("billing_id", "stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_id_key" ON "private"."product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "product_stripe_product_id_key" ON "private"."product"("stripe_product_id");

-- CreateIndex
CREATE INDEX "product_id_stripe_product_id_idx" ON "private"."product"("id", "stripe_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_id_key" ON "public"."profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_username_key" ON "public"."profile"("username");

-- AddForeignKey
ALTER TABLE "app"."client_data" ADD CONSTRAINT "client_data_id_fkey" FOREIGN KEY ("id") REFERENCES "app"."client"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."client" ADD CONSTRAINT "client_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "app"."build"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."client" ADD CONSTRAINT "client_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "app"."target"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."link_build_and_target" ADD CONSTRAINT "link_build_and_target_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "app"."build"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."link_build_and_target" ADD CONSTRAINT "link_build_and_target_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "app"."target"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "private"."subscription" ADD CONSTRAINT "subscription_billing_id_fkey" FOREIGN KEY ("billing_id") REFERENCES "private"."billing"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."profile" ADD CONSTRAINT "profile_id_fkey" FOREIGN KEY ("id") REFERENCES "private"."account"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
