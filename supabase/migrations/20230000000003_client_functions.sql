--------------------------------------------------
-- Management functions for table: client
--------------------------------------------------

-- CreateFunction
CREATE OR REPLACE FUNCTION app.client_auto_offline()
RETURNS VOID AS $$
BEGIN
    UPDATE app.client
    SET online = false
    WHERE online = true;
END;
$$ LANGUAGE plpgsql;

-- CreateCronJob
SELECT cron.schedule(
  'client_auto_offline',
  '*/3 * * * *',
  $$
    SELECT app.client_auto_offline()
  $$
);

-- CreateFunction
CREATE OR REPLACE FUNCTION app.client_clear_expired()
RETURNS VOID AS $$
BEGIN
    DELETE FROM app.client
    WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- CreateCronJob
SELECT cron.schedule(
  'client_clear_expired',
  '0 0 */7 * *',
  $$
    SELECT app.client_clear_expired()
  $$
);

-- CreateFunction
-- CREATE OR REPLACE FUNCTION app.client_clear_all()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     DELETE FROM app.client;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CreateTrigger
-- CREATE OR REPLACE TRIGGER client_clear_all_on_build_operations
-- AFTER INSERT OR UPDATE OR DELETE ON app.build
-- FOR EACH ROW EXECUTE PROCEDURE app.client_clear_all();

-- CreateFunction
CREATE OR REPLACE FUNCTION app.client_data_clear_data()
RETURNS TRIGGER AS $$
BEGIN
    NEW.client_data := jsonb_set(NEW.client_data, '{browserProperties}', 'null');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CreateTrigger (need to add overall data collection switch on account)

-- CreateFunction
CREATE OR REPLACE FUNCTION app.client_data_clear_browser_properties_data()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.browser_properties_allow_collect = false) THEN
    NEW.browser_properties := null;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CreateTrigger
CREATE OR REPLACE TRIGGER client_data_clear_data_on_browser_properties
BEFORE INSERT OR UPDATE ON app.client_data
FOR EACH ROW EXECUTE PROCEDURE app.client_data_clear_browser_properties_data();
