-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_billing_created_create_stripe_customer AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'https://anomie-bun-nuxt-templates-git-server-with-stripe-blaquewithaq.vercel.app/api/v1/stripe/webhooks/customer/create',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_billing_updated_update_stripe_customer AFTER
UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'https://anomie-bun-nuxt-templates-git-server-with-stripe-blaquewithaq.vercel.app/api/v1/stripe/webhooks/customer/update',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_billing_deleted_delete_stripe_customer AFTER DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'https://anomie-bun-nuxt-templates-git-server-with-stripe-blaquewithaq.vercel.app/api/v1/stripe/webhooks/customer/delete',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_product_created_create_stripe_product AFTER INSERT ON private.product FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'https://anomie-bun-nuxt-templates-git-server-with-stripe-blaquewithaq.vercel.app/api/v1/stripe/webhooks/product/create',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_product_updated_update_stripe_product AFTER
UPDATE ON private.product FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'https://anomie-bun-nuxt-templates-git-server-with-stripe-blaquewithaq.vercel.app/api/v1/stripe/webhooks/product/update',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_product_deleted_delete_stripe_product AFTER DELETE ON private.product FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'https://anomie-bun-nuxt-templates-git-server-with-stripe-blaquewithaq.vercel.app/api/v1/stripe/webhooks/product/delete',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);