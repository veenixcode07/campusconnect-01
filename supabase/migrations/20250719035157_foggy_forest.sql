/*
  # Update Sample Data for SAPID Login

  1. Updates
    - Update existing sample profiles to use SAPID-based emails
    - Ensure SAPID values are properly set for demo accounts

  Note: This migration updates the sample data to work with SAPID login
*/

-- Update sample profiles to use SAPID-based emails
UPDATE profiles SET 
  email = sapid || '@college.edu'
WHERE sapid IS NOT NULL;

-- Ensure we have the correct demo accounts
UPDATE profiles SET 
  email = 'STU001@college.edu',
  sapid = 'STU001'
WHERE name = 'John Doe';

UPDATE profiles SET 
  email = 'ADM001@college.edu', 
  sapid = 'ADM001'
WHERE name = 'Jane Smith';

UPDATE profiles SET 
  email = 'FAC001@college.edu',
  sapid = 'FAC001' 
WHERE name = 'Dr. Robert Johnson';