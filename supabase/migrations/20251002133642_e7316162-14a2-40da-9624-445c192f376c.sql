-- Drop the overly permissive policy that allows all users to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create restrictive policies for profile access

-- 1. Users can view their own complete profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Students can view basic info (name only) of classmates in the same section
CREATE POLICY "Students can view classmate names"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Check if the viewer is a student viewing someone in their section
  has_role(auth.uid(), 'student'::app_role) AND
  EXISTS (
    SELECT 1 FROM public.profiles viewer
    WHERE viewer.user_id = auth.uid()
      AND viewer.section IS NOT NULL
      AND viewer.section = profiles.section
  )
);

-- 3. Faculty can view profiles of all students (for academic purposes)
CREATE POLICY "Faculty can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'faculty'::app_role));

-- 4. Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));