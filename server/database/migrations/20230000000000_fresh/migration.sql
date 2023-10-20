-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app";

-- CreateEnum
CREATE TYPE "app"."target_platform" AS ENUM ('windows', 'macos', 'linux', 'android', 'ios', 'web', 'other');

-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('admin', 'user', 'beta', 'tester');

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
CREATE TABLE "app"."client" (
    "id" UUID NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "last_online" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "browser_properties" JSONB NOT NULL,
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
CREATE TABLE "app"."link_client_and_build" (
    "client_id" UUID NOT NULL,
    "build_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_client_and_build_pkey" PRIMARY KEY ("build_id","client_id")
);

-- CreateTable
CREATE TABLE "app"."link_client_and_target" (
    "client_id" UUID NOT NULL,
    "target_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_client_and_target_pkey" PRIMARY KEY ("client_id","target_id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "public"."user_role" NOT NULL DEFAULT 'user',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "client_id_key" ON "app"."client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "public"."user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "public"."user"("phone");

-- AddForeignKey
ALTER TABLE "app"."link_build_and_target" ADD CONSTRAINT "link_build_and_target_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "app"."build"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."link_build_and_target" ADD CONSTRAINT "link_build_and_target_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "app"."target"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."link_client_and_build" ADD CONSTRAINT "link_client_and_build_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "app"."build"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."link_client_and_build" ADD CONSTRAINT "link_client_and_build_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "app"."client"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."link_client_and_target" ADD CONSTRAINT "link_client_and_target_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "app"."client"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "app"."link_client_and_target" ADD CONSTRAINT "link_client_and_target_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "app"."target"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- SetPermissions
GRANT USAGE ON SCHEMA "app" TO postgres, authenticated, service_role, dashboard_user, supabase_admin;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "app" TO postgres, authenticated, service_role, dashboard_user, supabase_admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "app" TO postgres, authenticated, service_role, dashboard_user, supabase_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "app" TO postgres, authenticated, service_role, dashboard_user, supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT ALL ON TABLES TO postgres, authenticated, service_role, dashboard_user, supabase_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT ALL ON FUNCTIONS TO postgres, authenticated, service_role, dashboard_user, supabase_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT ALL ON SEQUENCES TO postgres, authenticated, service_role, dashboard_user, supabase_admin;

-- SetPermissions
GRANT USAGE ON SCHEMA "public" TO postgres, authenticated, service_role, dashboard_user, supabase_admin;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "public" TO postgres, authenticated, service_role, dashboard_user, supabase_admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "public" TO postgres, authenticated, service_role, dashboard_user, supabase_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "public" TO postgres, authenticated, service_role, dashboard_user, supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT ALL ON TABLES TO postgres, authenticated, service_role, dashboard_user, supabase_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO postgres, authenticated, service_role, dashboard_user, supabase_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT ALL ON SEQUENCES TO postgres, authenticated, service_role, dashboard_user, supabase_admin;
