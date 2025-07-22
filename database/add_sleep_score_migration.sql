-- Migration: Add sleep_score column to daily_records table
-- Run this in Supabase SQL editor to add sleep score functionality

ALTER TABLE daily_records 
ADD COLUMN sleep_score INT;

-- Optional: Add a comment to document what this column stores
COMMENT ON COLUMN daily_records.sleep_score IS 'Sleep score from external sleep tracking apps (0-100)';