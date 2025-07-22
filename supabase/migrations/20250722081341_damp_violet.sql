/*
  # Create Auth Users for Demo Accounts

  1. New Users
    - Create auth.users entries for demo accounts
    - Link profiles to auth users
    - Set up proper authentication

  2. Updates
    - Update profiles to reference auth.users
    - Ensure proper foreign key relationships
*/

-- Insert demo users into auth.users table
-- Note: In production, users would sign up through the auth system
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'student@college.edu',
    '$2a$10$8qvZ7Z7Z7Z7Z7Z7Z7Z7Z7uK7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z',
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'admin@college.edu',
    '$2a$10$8qvZ7Z7Z7Z7Z7Z7Z7Z7Z7uK7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z',
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'faculty@college.edu',
    '$2a$10$8qvZ7Z7Z7Z7Z7Z7Z7Z7Z7uK7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z',
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  )
ON CONFLICT (id) DO NOTHING;

-- Update profiles to ensure they reference the auth users
UPDATE profiles SET id = '00000000-0000-0000-0000-000000000001' WHERE sapid = 'STU001';
UPDATE profiles SET id = '00000000-0000-0000-0000-000000000002' WHERE sapid = 'ADM001';  
UPDATE profiles SET id = '00000000-0000-0000-0000-000000000003' WHERE sapid = 'FAC001';