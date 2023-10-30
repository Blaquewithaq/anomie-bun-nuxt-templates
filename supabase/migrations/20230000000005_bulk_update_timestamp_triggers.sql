--------------------------------------------------
-- Create Triggers for schema "app"
--------------------------------------------------

DO
  $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN
    SELECT tableName FROM pg_tables
    WHERE schemaName = 'app' AND tableName IN (
      'build',
      'target',
      'client',
      'client_data',
      'link_build_and_target'
    )
  LOOP
    EXECUTE 'CREATE TRIGGER on_' || table_record.tableName || '_updated_update_timestamp ' ||
            'BEFORE UPDATE ON app."' || table_record.tableName || '" ' ||
            'FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);';
  END LOOP;
END $$;

--------------------------------------------------
-- Create Triggers for schema "private"
--------------------------------------------------

DO
  $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN
    SELECT tableName FROM pg_tables
    WHERE schemaName = 'private' AND tableName IN (
      'account',
      'billing',
      'subscription',
      'product'
    )
  LOOP
    EXECUTE 'CREATE TRIGGER on_' || table_record.tableName || '_updated_update_timestamp ' ||
            'BEFORE UPDATE ON private."' || table_record.tableName || '" ' ||
            'FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);';
  END LOOP;
END $$;

--------------------------------------------------
-- Create Triggers for schema "public"
--------------------------------------------------
Do
  $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN
    SELECT tableName FROM pg_tables
    WHERE schemaName = 'public' AND tableName IN (
      'profile'
    )
  LOOP
    EXECUTE 'CREATE TRIGGER on_' || table_record.tableName || '_updated_update_timestamp ' ||
            'BEFORE UPDATE ON public."' || table_record.tableName || '" ' ||
            'FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);';
  END LOOP;
END $$;
