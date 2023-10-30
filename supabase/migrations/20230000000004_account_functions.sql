--------------------------------------------------
-- Scaffold functions for table: account
--------------------------------------------------

-- CreateFunction
CREATE OR REPLACE FUNCTION private.generate_new_account()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO private."account" (id, email, phone)
  VALUES (NEW.id, NEW.email, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
CREATE OR REPLACE TRIGGER on_auth_user_created_generate_new_account
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.generate_new_account();

-- CreateFunction
CREATE OR REPLACE FUNCTION private.generate_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."profile" (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
CREATE OR REPLACE TRIGGER on_auth_user_created_generate_new_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.generate_new_profile();

-- CreateFunction
CREATE OR REPLACE FUNCTION private.generate_new_billing()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO private."billing" (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
CREATE OR REPLACE TRIGGER on_auth_user_created_generate_new_billing
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.generate_new_billing();

-- CreateFunction
CREATE OR REPLACE FUNCTION private.generate_new_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO private."subscription" (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
CREATE OR REPLACE TRIGGER on_auth_user_created_generate_new_subscription
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.generate_new_subscription();

--------------------------------------------------
-- Management functions for table: account
--------------------------------------------------

-- CreateFunction
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
CREATE OR REPLACE TRIGGER on_auth_user_updated_update_account_email
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.update_account_email();

-- CreateFunction
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
CREATE OR REPLACE TRIGGER on_auth_user_updated_update_account_phone
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.update_account_phone();


-- CreateFunction
CREATE OR REPLACE FUNCTION private.update_account_username()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."profile"
  SET username = NEW.raw_user_meta_data->>'username'
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
CREATE OR REPLACE TRIGGER on_auth_user_updated_update_account_username
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.update_account_username();

-- CreateFunction
CREATE OR REPLACE FUNCTION private.delete_account()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM private."account" WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
CREATE OR REPLACE TRIGGER on_auth_user_deleted_delete_account
AFTER DELETE ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.delete_account();