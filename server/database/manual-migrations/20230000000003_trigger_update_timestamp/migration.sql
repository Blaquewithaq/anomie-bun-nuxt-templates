-- Recursive: CreateTriggers
-- Recursively updates the updated_at column for all tables in the app schema
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
      'link_build_and_target',
      'link_client_and_build',
      'link_client_and_target'
    )
  LOOP
    EXECUTE 'CREATE TRIGGER on_' || table_record.tableName || '_updated_update_timestamp ' ||
            'BEFORE UPDATE ON app."' || table_record.tableName || '" ' ||
            'FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);';
  END LOOP;
END $$;

-- Recursive: CreateTriggers
-- Recursively updates the updated_at column for all tables in the private schema
DO
  $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN
    SELECT tableName FROM pg_tables
    WHERE schemaName = 'private' AND tableName IN (
      'account',
      'account_stripe'
    )
  LOOP
    EXECUTE 'CREATE TRIGGER on_' || table_record.tableName || '_updated_update_timestamp ' ||
            'BEFORE UPDATE ON private."' || table_record.tableName || '" ' ||
            'FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);';
  END LOOP;
END $$;

-- Recursive: CreateTriggers
-- Recursively updates the updated_at column for all tables in the public schema
DO
  $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN
    SELECT tableName FROM pg_tables
    WHERE schemaName = 'public' AND tableName IN (
      'account_profile'
    )
  LOOP
    EXECUTE 'CREATE TRIGGER on_' || table_record.tableName || '_updated_update_timestamp ' ||
            'BEFORE UPDATE ON public."' || table_record.tableName || '" ' ||
            'FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);';
  END LOOP;
END $$;
