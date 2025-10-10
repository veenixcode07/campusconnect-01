-- Fix: allow unauthenticated clients to call the email lookup during login
REVOKE EXECUTE ON FUNCTION public.get_email_by_sapid(TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_by_sapid(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_email_by_sapid(TEXT) TO authenticated;

-- Normalize SAPIDs to upper-case to avoid case mismatches (optional safety)
UPDATE public.profiles SET sapid = upper(sapid) WHERE sapid IS NOT NULL;
UPDATE public.students SET sapid = upper(sapid) WHERE sapid IS NOT NULL;

-- Set test user passwords to simple value 'password' as requested
UPDATE auth.users
SET 
  encrypted_password = crypt('password', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email IN (
  'student1@test.com',
  'student2@test.com',
  'student3@test.com',
  'faculty@test.com',
  'admin@test.com'
);
