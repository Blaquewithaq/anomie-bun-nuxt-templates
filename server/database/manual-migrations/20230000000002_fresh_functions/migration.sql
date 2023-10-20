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
    WHERE created_at < NOW() - INTERVAL '30 days';
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
CREATE OR REPLACE TRIGGER client_clear_all_on_build_operations
AFTER INSERT OR UPDATE OR DELETE ON app.build
FOR EACH ROW EXECUTE PROCEDURE app.client_clear_all();
