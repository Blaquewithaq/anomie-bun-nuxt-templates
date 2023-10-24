-- CreateFunction
-- This function updates the email in the account table when the email is updated in the auth.users table
CREATE OR REPLACE FUNCTION private.update_account_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE private."account"
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
-- This trigger calls the update_account_email function when the email is updated in the auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_updated_update_account_email
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.update_account_email();

-- CreateFunction
-- This function updates the phone number in the account table when the phone number is updated in the auth.users table
CREATE OR REPLACE FUNCTION private.update_account_phone()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE private."account"
  SET phone = NEW.phone
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
-- This trigger calls the update_account_phone function when the phone number is updated in the auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_updated_update_account_phone
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.update_account_phone();


-- CreateFunction
-- This function updates the username in the account table when the username is updated in the auth.users table
CREATE OR REPLACE FUNCTION private.update_account_username()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."account_profile"
  SET username = NEW.raw_user_meta_data->>'username'
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
-- This trigger calls the update_account_username function when the username is updated in the auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_updated_update_account_username
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.update_account_username();

-- CreateFunction: app.client_auto_offline
CREATE OR REPLACE FUNCTION app.client_auto_offline()
RETURNS VOID AS $$
BEGIN
    UPDATE app.client
    SET online = false
    WHERE online = true;
END;
$$ LANGUAGE plpgsql;

-- CronJob: app.client_auto_offline
SELECT cron.schedule(
  'client_auto_offline',
  '*/3 * * * *',
  $$
    SELECT app.client_auto_offline()
  $$
);

-- CreateFunction: app.client_clear_expired
CREATE OR REPLACE FUNCTION app.client_clear_expired()
RETURNS VOID AS $$
BEGIN
    DELETE FROM app.client
    WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- CronJob: app.client_clear_expired
SELECT cron.schedule(
  'client_clear_expired',
  '0 0 */7 * *',
  $$
    SELECT app.client_clear_expired()
  $$
);

-- CreateFunction: app.client_clear_all, when build_table is updated
CREATE OR REPLACE FUNCTION app.client_clear_all()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM app.client;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CreateTrigger: app.client_clear_all
-- CREATE OR REPLACE TRIGGER client_clear_all_on_build_operations
-- AFTER INSERT OR UPDATE OR DELETE ON app.build
-- FOR EACH ROW EXECUTE PROCEDURE app.client_clear_all();

-- CreateFunction: app.client_data_clear_data
CREATE OR REPLACE FUNCTION app.client_data_clear_data()
RETURNS TRIGGER AS $$
BEGIN
    NEW.client_data := jsonb_set(NEW.client_data, '{browserProperties}', 'null');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CreateFunction: app.client_data_clear_browser_properties_data
CREATE OR REPLACE FUNCTION app.client_data_clear_browser_properties_data()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.browser_properties_allow_collect = false) THEN
    NEW.browser_properties := null;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CreateTrigger: app.client_data_clear_browser_properties_data
CREATE OR REPLACE TRIGGER client_data_clear_data_on_browser_properties
BEFORE INSERT OR UPDATE ON app.client_data
FOR EACH ROW EXECUTE PROCEDURE app.client_data_clear_browser_properties_data();
