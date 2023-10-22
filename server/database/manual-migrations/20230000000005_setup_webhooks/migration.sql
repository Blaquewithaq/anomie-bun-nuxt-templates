-- CreateTriggerWebhook
CREATE OR REPLACE TRIGGER on_auth_user_created_create_stripe_customer
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"(
  'http://localhost:3000/api/v1/webhooks/stripe/create-customer',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);
