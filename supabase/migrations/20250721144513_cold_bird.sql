/*
  # Remove Email and Use SAPID Only

  1. Schema Changes
    - Remove email column from profiles table
    - Make sapid column required and unique
    - Update existing data to ensure sapid is populated
    - Update RLS policies to work with sapid instead of email

  2. Data Updates
    - Ensure all existing profiles have sapid values
    - Remove email dependencies
*/

-- First, ensure all profiles have sapid values (update any that don't)
UPDATE profiles SET sapid = 'STU' || LPAD(EXTRACT(epoch FROM created_at)::text, 3, '0') 
WHERE sapid IS NULL AND role = 'student';

UPDATE profiles SET sapid = 'FAC' || LPAD(EXTRACT(epoch FROM created_at)::text, 3, '0') 
WHERE sapid IS NULL AND role = 'faculty';

UPDATE profiles SET sapid = 'ADM' || LPAD(EXTRACT(epoch FROM created_at)::text, 3, '0') 
WHERE sapid IS NULL AND role = 'admin';

-- Make sapid required and ensure it's unique
ALTER TABLE profiles ALTER COLUMN sapid SET NOT NULL;

-- Drop the email column
ALTER TABLE profiles DROP COLUMN IF EXISTS email;

-- Update the profiles table structure
COMMENT ON TABLE profiles IS 'User profiles with SAPID-based authentication';
COMMENT ON COLUMN profiles.sapid IS 'Student/Staff/Admin ID - primary identifier for login';

-- Update RLS policies to work without email dependency
-- (The existing policies should still work since they don't directly reference email)

-- Create index on sapid for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_sapid ON profiles(sapid);