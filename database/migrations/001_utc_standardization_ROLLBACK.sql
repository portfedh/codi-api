-- =====================================================================
-- UTC Timestamp Standardization Migration - ROLLBACK
-- =====================================================================
-- Description: Reverts the UTC standardization migration
-- Author: CoDi API Team
-- Date: 2025-01-12
-- Version: 1.0
--
-- WARNING: Only run this if you need to rollback the migration
-- This will restore the previous mixed timezone approach
-- =====================================================================

DO $$
BEGIN
  RAISE NOTICE '
  ============================================================
  STARTING UTC MIGRATION ROLLBACK
  ============================================================
  This will restore the previous timezone configuration.
  ';
END $$;

-- =====================================================================
-- STEP 1: RESTORE api_keys.edited_at TO TIMESTAMP WITHOUT TIMEZONE
-- =====================================================================

ALTER TABLE api_keys
  ALTER COLUMN edited_at TYPE timestamp without time zone
  USING edited_at AT TIME ZONE 'America/Mexico_City';

ALTER TABLE api_keys
  ALTER COLUMN edited_at SET DEFAULT now();

COMMENT ON COLUMN api_keys.edited_at IS 'Timestamp when API key was last edited (no timezone - server time)';

-- =====================================================================
-- STEP 2: RESTORE TIMEZONE-SPECIFIC DEFAULTS
-- =====================================================================

-- api_keys.last_used - restore Mexico City default
ALTER TABLE api_keys
  ALTER COLUMN last_used SET DEFAULT (now() AT TIME ZONE 'America/Mexico_City');

COMMENT ON COLUMN api_keys.last_used IS 'Timestamp when API key was last used (Mexico City time)';

-- requests.created_at - restore UTC explicit default
ALTER TABLE requests
  ALTER COLUMN created_at SET DEFAULT (now() AT TIME ZONE 'utc');

COMMENT ON COLUMN requests.created_at IS 'Timestamp when request record was created (UTC explicit)';

-- requests.request_timestamp - restore Mexico City default
ALTER TABLE requests
  ALTER COLUMN request_timestamp SET DEFAULT (now() AT TIME ZONE 'America/Mexico_City');

COMMENT ON COLUMN requests.request_timestamp IS 'Timestamp when API request was received (Mexico City time)';

-- responses.created_at - restore Mexico City default
ALTER TABLE responses
  ALTER COLUMN created_at SET DEFAULT (now() AT TIME ZONE 'America/Mexico_City');

COMMENT ON COLUMN responses.created_at IS 'Timestamp when response record was created (Mexico City time)';

-- responses.response_timestamp - restore Mexico City default
ALTER TABLE responses
  ALTER COLUMN response_timestamp SET DEFAULT (now() AT TIME ZONE 'America/Mexico_City');

COMMENT ON COLUMN responses.response_timestamp IS 'Timestamp when API response was sent (Mexico City time)';

-- =====================================================================
-- STEP 3: DROP MEXICO CITY VIEWS (IF THEY EXIST)
-- =====================================================================

DROP VIEW IF EXISTS requests_mexico_city;
DROP VIEW IF EXISTS responses_mexico_city;

-- =====================================================================
-- STEP 4: VERIFY ROLLBACK
-- =====================================================================

SELECT
  table_name,
  column_name,
  data_type,
  column_default,
  CASE
    WHEN table_name = 'api_keys' AND column_name = 'edited_at' AND data_type = 'timestamp without time zone'
      THEN '✅ Rolled back to timestamp without tz'
    WHEN column_default LIKE '%America/Mexico_City%'
      THEN '✅ Mexico City timezone restored'
    WHEN column_default LIKE '%utc%'
      THEN '✅ UTC explicit restored'
    WHEN column_default = 'now()'
      THEN '⚠️ Standard now() (not rolled back)'
    ELSE '❓ Check manually'
  END as rollback_status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('api_keys', 'customers', 'folios_codi', 'requests', 'responses')
  AND data_type LIKE '%timestamp%'
ORDER BY table_name, ordinal_position;

-- =====================================================================
-- STEP 5: DATA RESTORATION (OPTIONAL - ONLY IF DATA CORRUPTION)
-- =====================================================================
-- WARNING: This is destructive and will delete current data
-- Only uncomment and run if data was corrupted during migration

/*
-- Check if backups exist
SELECT
  to_regclass('public.backup_api_keys_' || to_char(current_date, 'YYYYMMDD')) as api_keys_backup,
  to_regclass('public.backup_requests_' || to_char(current_date, 'YYYYMMDD')) as requests_backup,
  to_regclass('public.backup_responses_' || to_char(current_date, 'YYYYMMDD')) as responses_backup;

-- If backups exist and you need to restore data:

-- Restore api_keys (DESTRUCTIVE)
TRUNCATE TABLE api_keys CASCADE;
EXECUTE format('INSERT INTO api_keys SELECT * FROM backup_api_keys_%s',
  to_char(current_date, 'YYYYMMDD'));

-- Restore requests (DESTRUCTIVE)
TRUNCATE TABLE requests CASCADE;
EXECUTE format('INSERT INTO requests SELECT * FROM backup_requests_%s',
  to_char(current_date, 'YYYYMMDD'));

-- Restore responses (DESTRUCTIVE)
TRUNCATE TABLE responses CASCADE;
EXECUTE format('INSERT INTO responses SELECT * FROM backup_responses_%s',
  to_char(current_date, 'YYYYMMDD'));
*/

-- =====================================================================
-- ROLLBACK COMPLETE
-- =====================================================================

DO $$
BEGIN
  RAISE NOTICE '
  ============================================================
  ROLLBACK COMPLETED
  ============================================================

  Summary of rollback:
  - ✅ Restored api_keys.edited_at to timestamp without time zone
  - ✅ Restored Mexico City timezone defaults
  - ✅ Removed Mexico City timezone views
  - ⚠️ Backup tables still exist (backup_*_YYYYMMDD)

  Next steps:
  1. Rollback application code (git revert)
  2. Restart application server
  3. Test all endpoints
  4. Investigate root cause of migration issues

  Note: Backup tables were NOT deleted - you can drop them manually:
    DROP TABLE backup_api_keys_YYYYMMDD;
    DROP TABLE backup_requests_YYYYMMDD;
    DROP TABLE backup_responses_YYYYMMDD;
  ============================================================
  ';
END $$;
