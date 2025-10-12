/*
  # Add Section Column to Profiles

  1. Schema Changes
    - Add section column to profiles table for student class sections
    - Update sample data to include sections

  2. Updates
    - Add section field for better student organization
    - Update existing profiles with sample section data
*/

-- Add section column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS section text;

-- Update existing sample data with sections
UPDATE profiles SET section = 'A' WHERE sapid = 'STU001';
UPDATE profiles SET section = 'B' WHERE sapid IN ('STU002', 'STU003');
UPDATE profiles SET section = 'A' WHERE sapid = 'STU004';

-- Add comment for the new column
COMMENT ON COLUMN profiles.section IS 'Student class section (A, B, C, etc.)';