-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "private";

-- CreateEnum
CREATE TYPE "app"."target_platform" AS ENUM (
  'windows',
  'macos',
  'linux',
  'android',
  'ios',
  'web',
  'other'
);

-- CreateEnum
CREATE TYPE "private"."account_role" AS ENUM ('admin', 'user', 'beta', 'tester');

-- CreateTable
CREATE TABLE
  "app"."build" (
    "id" UUID NOT NULL,
    "codename" TEXT NOT NULL,
    "changelog" TEXT NOT NULL,
    "buildDate" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "build_pkey" PRIMARY KEY ("id")
  );

-- CreateTable
CREATE TABLE
  "app"."target" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "platform" "app"."target_platform" NOT NULL,
    "created_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "target_pkey" PRIMARY KEY ("id")
  );

-- CreateTable
CREATE TABLE
  "app"."client_data" (
    "id" UUID NOT NULL,
    "browser_properties_allow_collect" BOOLEAN NOT NULL DEFAULT true,
    "browser_properties" JSONB,
    "created_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "client_data_pkey" PRIMARY KEY ("id")
  );

-- CreateTable
CREATE TABLE
  "app"."client" (
    "id" UUID NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "last_online" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "build_id" UUID NOT NULL,
    "target_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
  );

-- CreateTable
CREATE TABLE
  "app"."link_build_and_target" (
    "build_id" UUID NOT NULL,
    "target_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "link_build_and_target_pkey" PRIMARY KEY ("build_id", "target_id")
  );

-- CreateTable
CREATE TABLE
  "private"."account" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "private"."account_role" NOT NULL DEFAULT 'user',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
  );

-- CreateTable
CREATE TABLE
  "private"."account_billing" (
    "id" UUID NOT NULL,
    "stripe_id" TEXT,
    "created_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "account_billing_pkey" PRIMARY KEY ("id")
  );

-- CreateTable
CREATE TABLE
  "private"."billing_subscription" (
    "id" UUID NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "billing_subscription_pkey" PRIMARY KEY ("id")
  );

-- CreateTable
CREATE TABLE
  "private"."product" (
    "id" UUID NOT NULL,
    "stripe_product_id" TEXT NOT NULL,
    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
  );

-- CreateTable
CREATE TABLE
  "public"."account_profile" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ (6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "account_profile_pkey" PRIMARY KEY ("id")
  );

-- CreateIndex
CREATE UNIQUE INDEX "build_id_key" ON "app"."build" ("id");

-- CreateIndex
CREATE UNIQUE INDEX "build_codename_key" ON "app"."build" ("codename");

-- CreateIndex
CREATE UNIQUE INDEX "build_version_key" ON "app"."build" ("version");

-- CreateIndex
CREATE UNIQUE INDEX "target_id_key" ON "app"."target" ("id");

-- CreateIndex
CREATE UNIQUE INDEX "target_name_key" ON "app"."target" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "client_data_id_key" ON "app"."client_data" ("id");

-- CreateIndex
CREATE UNIQUE INDEX "client_id_key" ON "app"."client" ("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_id_key" ON "private"."account" ("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "private"."account" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_phone_key" ON "private"."account" ("phone");

-- CreateIndex
CREATE UNIQUE INDEX "account_billing_id_key" ON "private"."account_billing" ("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_billing_stripe_id_key" ON "private"."account_billing" ("stripe_id");

-- CreateIndex
CREATE UNIQUE INDEX "billing_subscription_id_key" ON "private"."billing_subscription" ("id");

-- CreateIndex
CREATE UNIQUE INDEX "billing_subscription_subscription_id_key" ON "private"."billing_subscription" ("subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "billing_subscription_product_id_key" ON "private"."billing_subscription" ("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_id_key" ON "private"."product" ("id");

-- CreateIndex
CREATE UNIQUE INDEX "product_stripe_product_id_key" ON "private"."product" ("stripe_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_profile_id_key" ON "public"."account_profile" ("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_profile_username_key" ON "public"."account_profile" ("username");

-- AddForeignKey
ALTER TABLE "app"."client_data" ADD CONSTRAINT "client_data_id_fkey" FOREIGN KEY ("id") REFERENCES "app"."client" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."client" ADD CONSTRAINT "client_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "app"."build" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."client" ADD CONSTRAINT "client_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "app"."target" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."link_build_and_target" ADD CONSTRAINT "link_build_and_target_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "app"."build" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."link_build_and_target" ADD CONSTRAINT "link_build_and_target_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "app"."target" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "private"."account_billing" ADD CONSTRAINT "account_billing_id_fkey" FOREIGN KEY ("id") REFERENCES "private"."account" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "private"."billing_subscription" ADD CONSTRAINT "billing_subscription_id_fkey" FOREIGN KEY ("id") REFERENCES "private"."account_billing" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."account_profile" ADD CONSTRAINT "account_profile_id_fkey" FOREIGN KEY ("id") REFERENCES "private"."account" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
