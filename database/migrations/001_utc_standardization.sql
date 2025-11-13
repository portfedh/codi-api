-- =====================================================================
-- UTC Timestamp Standardization Migration
-- =====================================================================
-- Description: Converts all timestamp handling to UTC storage
-- Author: CoDi API Team
-- Date: 2025-01-12
-- Version: 1.0
--
-- IMPORTANT: Run this migration in Supabase SQL Editor
-- Estimated execution time: < 1 second
-- =====================================================================

-- =====================================================================
-- STEP 1: CREATE BACKUPS
-- =====================================================================
-- These backups allow for easy rollback if needed
-- Backups are timestamped with YYYYMMDD format

DO $$
BEGIN
  -- Backup api_keys table
  EXECUTE format('CREATE TABLE IF NOT EXISTS backup_api_keys_%s AS SELECT * FROM api_keys',
    to_char(current_date, 'YYYYMMDD'));
  RAISE NOTICE 'Created backup: backup_api_keys_%', to_char(current_date, 'YYYYMMDD');

  -- Backup requests table
  EXECUTE format('CREATE TABLE IF NOT EXISTS backup_requests_%s AS SELECT * FROM requests',
    to_char(current_date, 'YYYYMMDD'));
  RAISE NOTICE 'Created backup: backup_requests_%', to_char(current_date, 'YYYYMMDD');

  -- Backup responses table
  EXECUTE format('CREATE TABLE IF NOT EXISTS backup_responses_%s AS SELECT * FROM responses',
    to_char(current_date, 'YYYYMMDD'));
  RAISE NOTICE 'Created backup: backup_responses_%', to_char(current_date, 'YYYYMMDD');

  RAISE NOTICE 'All backups created successfully!';
END $$;

-- =====================================================================
-- STEP 2: VERIFY CURRENT STATE
-- =====================================================================
-- This query shows the current state of all timestamp columns
-- Review the output before proceeding with migrations

SELECT
  table_name,
  column_name,
  data_type,
  column_default,
  CASE
    WHEN data_type = 'timestamp with time zone' THEN '✅ timestamptz'
    WHEN data_type = 'timestamp without time zone' THEN '❌ timestamp (no tz)'
    ELSE '⚠️ other'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('api_keys', 'customers', 'folios_codi', 'requests', 'responses')
  AND data_type LIKE '%timestamp%'
ORDER BY table_name, ordinal_position;

-- =====================================================================
-- STEP 3: FIX api_keys.edited_at COLUMN
-- =====================================================================
-- Problem: This column is "timestamp without time zone" which is ambiguous
-- Solution: Convert to timestamptz, assuming existing data is Mexico City time

ALTER TABLE api_keys
  ALTER COLUMN edited_at TYPE timestamptz
  USING edited_at AT TIME ZONE 'America/Mexico_City';

-- Update default to standard UTC now()
ALTER TABLE api_keys
  ALTER COLUMN edited_at SET DEFAULT now();

COMMENT ON COLUMN api_keys.edited_at IS 'Timestamp when API key was last edited (UTC)';

-- =====================================================================
-- STEP 4: STANDARDIZE DEFAULT VALUES TO UTC
-- =====================================================================
-- Remove explicit timezone conversions from defaults
-- PostgreSQL's now() already returns current UTC time for timestamptz columns

-- api_keys table
ALTER TABLE api_keys
  ALTER COLUMN last_used SET DEFAULT now();

COMMENT ON COLUMN api_keys.last_used IS 'Timestamp when API key was last used (UTC)';

-- requests table
ALTER TABLE requests
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE requests
  ALTER COLUMN request_timestamp SET DEFAULT now();

COMMENT ON COLUMN requests.created_at IS 'Timestamp when request record was created (UTC)';
COMMENT ON COLUMN requests.request_timestamp IS 'Timestamp when API request was received (UTC)';

-- responses table
ALTER TABLE responses
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE responses
  ALTER COLUMN response_timestamp SET DEFAULT now();

COMMENT ON COLUMN responses.created_at IS 'Timestamp when response record was created (UTC)';
COMMENT ON COLUMN responses.response_timestamp IS 'Timestamp when API response was sent (UTC)';

-- =====================================================================
-- STEP 5: VERIFY MIGRATION SUCCESS
-- =====================================================================
-- All columns should now show:
-- - data_type: "timestamp with time zone"
-- - column_default: "now()"

SELECT
  table_name,
  column_name,
  data_type,
  column_default,
  CASE
    WHEN data_type = 'timestamp with time zone' AND column_default = 'now()' THEN '✅ CORRECT'
    WHEN data_type = 'timestamp with time zone' THEN '⚠️ timestamptz but non-standard default'
    ELSE '❌ NEEDS FIXING'
  END as migration_status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('api_keys', 'customers', 'folios_codi', 'requests', 'responses')
  AND data_type LIKE '%timestamp%'
ORDER BY table_name, ordinal_position;

-- =====================================================================
-- STEP 6: DATA INTEGRITY CHECKS
-- =====================================================================
-- Verify no NULL timestamps exist (except for nullable columns)

DO $$
DECLARE
  null_count integer;
BEGIN
  -- Check api_keys
  SELECT COUNT(*) INTO null_count FROM api_keys WHERE created_at IS NULL OR edited_at IS NULL;
  IF null_count > 0 THEN
    RAISE WARNING 'Found % NULL timestamps in api_keys', null_count;
  ELSE
    RAISE NOTICE 'api_keys: All timestamps valid ✅';
  END IF;

  -- Check requests
  SELECT COUNT(*) INTO null_count FROM requests WHERE created_at IS NULL OR request_timestamp IS NULL;
  IF null_count > 0 THEN
    RAISE WARNING 'Found % NULL timestamps in requests', null_count;
  ELSE
    RAISE NOTICE 'requests: All timestamps valid ✅';
  END IF;

  -- Check responses
  SELECT COUNT(*) INTO null_count FROM responses WHERE created_at IS NULL OR response_timestamp IS NULL;
  IF null_count > 0 THEN
    RAISE WARNING 'Found % NULL timestamps in responses', null_count;
  ELSE
    RAISE NOTICE 'responses: All timestamps valid ✅';
  END IF;

  RAISE NOTICE 'Data integrity checks completed!';
END $$;

-- =====================================================================
-- STEP 7: CREATE VIEW FOR MEXICO CITY TIME (OPTIONAL)
-- =====================================================================
-- This view provides easy access to timestamps in Mexico City timezone
-- Useful for reporting and debugging

CREATE OR REPLACE VIEW requests_mexico_city AS
SELECT
  id,
  route,
  api_key,
  request_payload,
  request_timestamp AT TIME ZONE 'America/Mexico_City' as request_time_mexico_city,
  created_at AT TIME ZONE 'America/Mexico_City' as created_at_mexico_city,
  environment
FROM requests;

COMMENT ON VIEW requests_mexico_city IS 'Requests with timestamps displayed in America/Mexico_City timezone';

CREATE OR REPLACE VIEW responses_mexico_city AS
SELECT
  id,
  request_id,
  response_payload,
  response_status,
  response_timestamp AT TIME ZONE 'America/Mexico_City' as response_time_mexico_city,
  created_at AT TIME ZONE 'America/Mexico_City' as created_at_mexico_city,
  environment
FROM responses;

COMMENT ON VIEW responses_mexico_city IS 'Responses with timestamps displayed in America/Mexico_City timezone';

-- =====================================================================
-- MIGRATION COMPLETE
-- =====================================================================

DO $$
BEGIN
  RAISE NOTICE '
  ============================================================
  UTC MIGRATION COMPLETED SUCCESSFULLY! ✅
  ============================================================

  Summary of changes:
  - ✅ Fixed api_keys.edited_at: timestamp → timestamptz
  - ✅ Standardized all defaults to now() (UTC)
  - ✅ Added UTC comments to all timestamp columns
  - ✅ Created backup tables (backup_*_YYYYMMDD)
  - ✅ Created Mexico City timezone views for reporting

  Next steps:
  1. Update application code to use moment.utc()
  2. Run application tests
  3. Deploy updated application code
  4. Monitor for 15 minutes

  Rollback available if needed - see rollback script.
  ============================================================
  ';
END $$;
