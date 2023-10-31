--------------------------------------------------
-- Extensions
--------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "moddatetime" SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "pg_cron" SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "pg_net" SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

--------------------------------------------------
-- Create & SetPermissions for schema "app"
--------------------------------------------------
CREATE SCHEMA IF NOT EXISTS "app";

GRANT USAGE ON SCHEMA "app" TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "app" TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "app" TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "app" TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT ALL ON TABLES TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT ALL ON FUNCTIONS TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT ALL ON SEQUENCES TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

--------------------------------------------------
-- Create & SetPermissions for schema "private"
--------------------------------------------------
CREATE SCHEMA IF NOT EXISTS "private";

GRANT USAGE ON SCHEMA "private" TO postgres,
service_role,
dashboard_user,
supabase_admin;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "private" TO postgres,
service_role,
dashboard_user,
supabase_admin;

GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "private" TO postgres,
service_role,
dashboard_user,
supabase_admin;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "private" TO postgres,
service_role,
dashboard_user,
supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "private" GRANT ALL ON TABLES TO postgres,
service_role,
dashboard_user,
supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "private" GRANT ALL ON FUNCTIONS TO postgres,
service_role,
dashboard_user,
supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "private" GRANT ALL ON SEQUENCES TO postgres,
service_role,
dashboard_user,
supabase_admin;

--------------------------------------------------
-- Create & SetPermissions for schema "public"
--------------------------------------------------
CREATE SCHEMA IF NOT EXISTS "public";

GRANT USAGE ON SCHEMA "public" TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "public" TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "public" TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "public" TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT ALL ON TABLES TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT ALL ON SEQUENCES TO postgres,
authenticated,
service_role,
dashboard_user,
supabase_admin;
