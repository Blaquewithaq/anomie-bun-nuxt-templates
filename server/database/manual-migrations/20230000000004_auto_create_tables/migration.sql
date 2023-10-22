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
CREATE OR REPLACE FUNCTION private.generate_new_account_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."account_profile" (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
CREATE OR REPLACE TRIGGER on_auth_user_created_generate_new_account_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.generate_new_account_profile();

-- CreateFunction
CREATE OR REPLACE FUNCTION private.generate_new_account_stripe()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO private."account_stripe" (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CreateTrigger
CREATE OR REPLACE TRIGGER on_auth_user_created_generate_new_account_stripe
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE private.generate_new_account_stripe();

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
