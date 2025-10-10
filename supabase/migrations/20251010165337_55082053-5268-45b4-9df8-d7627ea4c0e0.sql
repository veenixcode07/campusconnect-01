-- First, delete existing data (cascading will handle related tables)
TRUNCATE TABLE public.user_roles CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.students CASCADE;
TRUNCATE TABLE public.attendance_records CASCADE;
TRUNCATE TABLE public.attendance_logs CASCADE;
TRUNCATE TABLE public.student_notes CASCADE;
TRUNCATE TABLE public.queries CASCADE;
TRUNCATE TABLE public.query_answers CASCADE;
TRUNCATE TABLE public.notices CASCADE;
TRUNCATE TABLE public.assignments CASCADE;
TRUNCATE TABLE public.resources CASCADE;

-- Delete users from auth.users (this will cascade to profiles via trigger)
DELETE FROM auth.users;

-- Create test student users
-- Password for all users is: password123
DO $$
DECLARE
  student1_id uuid := gen_random_uuid();
  student2_id uuid := gen_random_uuid();
  student3_id uuid := gen_random_uuid();
  faculty1_id uuid := gen_random_uuid();
  admin1_id uuid := gen_random_uuid();
BEGIN
  -- Insert test users into auth.users (trigger will create profiles automatically)
  INSERT INTO auth.users (
    id, 
    email, 
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES
    (student1_id, 'student1@test.com', crypt('password123', gen_salt('bf')), now(), 
     '{"name": "Student One", "sapid": "STU001", "section": "A", "department": "Computer Science", "year": "2024"}'::jsonb, 
     now(), now(), '', ''),
    (student2_id, 'student2@test.com', crypt('password123', gen_salt('bf')), now(), 
     '{"name": "Student Two", "sapid": "STU002", "section": "A", "department": "Computer Science", "year": "2024"}'::jsonb, 
     now(), now(), '', ''),
    (student3_id, 'student3@test.com', crypt('password123', gen_salt('bf')), now(), 
     '{"name": "Student Three", "sapid": "STU003", "section": "B", "department": "Computer Science", "year": "2024"}'::jsonb, 
     now(), now(), '', ''),
    (faculty1_id, 'faculty@test.com', crypt('password123', gen_salt('bf')), now(), 
     '{"name": "Dr. Faculty", "sapid": "FAC001", "department": "Computer Science"}'::jsonb, 
     now(), now(), '', ''),
    (admin1_id, 'admin@test.com', crypt('password123', gen_salt('bf')), now(), 
     '{"name": "Admin User", "sapid": "ADM001"}'::jsonb, 
     now(), now(), '', '');

  -- Create student records for the students
  INSERT INTO public.students (sapid, name, section, email, status, attendance_percentage, average_grade)
  VALUES
    ('STU001', 'Student One', 'A', 'student1@test.com', 'active', 85.5, 78.5),
    ('STU002', 'Student Two', 'A', 'student2@test.com', 'active', 92.0, 85.0),
    ('STU003', 'Student Three', 'B', 'student3@test.com', 'active', 75.5, 72.0);
END $$;