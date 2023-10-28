-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_auth_user_created_create_stripe_customer AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'http://localhost:3000/api/v1/webhooks/stripe/create-customer',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_auth_user_created_create_stripe_customer AFTER
UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'http://localhost:3000/api/v1/webhooks/stripe/update-customer',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

-- CreateTriggerWebhook
CREATE
OR REPLACE TRIGGER on_auth_user_created_create_stripe_customer AFTER DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request" (
  'http://localhost:3000/api/v1/webhooks/stripe/delete-customer',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);
