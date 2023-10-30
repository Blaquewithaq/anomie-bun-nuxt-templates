-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_billing_created_create_stripe_customer AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'http://localhost:3000/api/v1/webhooks/stripe/customer/create',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_billing_updated_update_stripe_customer AFTER
UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'http://localhost:3000/api/v1/webhooks/stripe/customer/update',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_billing_deleted_delete_stripe_customer AFTER DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'http://localhost:3000/api/v1/webhooks/stripe/customer/delete',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_product_created_create_stripe_product AFTER INSERT ON private.product FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'http://localhost:3000/api/v1/webhooks/stripe/product/create',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_product_updated_update_stripe_product AFTER
UPDATE ON private.product FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'http://localhost:3000/api/v1/webhooks/stripe/product/update',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_product_deleted_delete_stripe_product AFTER DELETE ON private.product FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'http://localhost:3000/api/v1/webhooks/stripe/product/delete',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);
