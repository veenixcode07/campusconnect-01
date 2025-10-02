-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'faculty', 'student');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create helper function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'faculty' THEN 2
      WHEN 'student' THEN 3
    END
  LIMIT 1;
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Remove role column from profiles (keep for backward compatibility temporarily)
-- We'll migrate data in next step
ALTER TABLE public.profiles 
  ALTER COLUMN role DROP NOT NULL;

-- Update handle_new_user function to create role entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, name, sapid, department, year, section, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.raw_user_meta_data->>'sapid',
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'year',
    NEW.raw_user_meta_data->>'section',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  
  -- Insert role into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student'::app_role)
  );
  
  RETURN NEW;
END;
$$;

-- Update RLS policies to use has_role function
-- Update students table policies
DROP POLICY IF EXISTS "Faculty and admin can manage students" ON public.students;
CREATE POLICY "Faculty and admin can manage students"
ON public.students
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Update assignments policies
DROP POLICY IF EXISTS "Faculty and admin can create assignments" ON public.assignments;
CREATE POLICY "Faculty and admin can create assignments"
ON public.assignments
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Update notices policies  
DROP POLICY IF EXISTS "Faculty and admin can create notices" ON public.notices;
CREATE POLICY "Faculty and admin can create notices"
ON public.notices
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Update resources policies
DROP POLICY IF EXISTS "Faculty and admin can create resources" ON public.resources;
CREATE POLICY "Faculty and admin can create resources"
ON public.resources
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Update student_notes policies
DROP POLICY IF EXISTS "Faculty and admin can create student notes" ON public.student_notes;
CREATE POLICY "Faculty and admin can create student notes"
ON public.student_notes
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Faculty and admin can view all student notes" ON public.student_notes;
CREATE POLICY "Faculty and admin can view all student notes"
ON public.student_notes
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Update attendance policies
DROP POLICY IF EXISTS "Faculty and admin can manage attendance logs" ON public.attendance_logs;
CREATE POLICY "Faculty and admin can manage attendance logs"
ON public.attendance_logs
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Faculty and admin can manage attendance records" ON public.attendance_records;
CREATE POLICY "Faculty and admin can manage attendance records"
ON public.attendance_records
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'faculty') OR 
  public.has_role(auth.uid(), 'admin')
);

-- Update query policies
DROP POLICY IF EXISTS "Users can view class-allowed queries" ON public.queries;
CREATE POLICY "Users can view class-allowed queries"
ON public.queries
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'faculty') OR
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid() 
    AND p.section = queries.author_class
  )
);

DROP POLICY IF EXISTS "Faculty can update answers in their classes" ON public.query_answers;
CREATE POLICY "Faculty can update answers in their classes"
ON public.query_answers
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'faculty') AND
  EXISTS (
    SELECT 1 FROM queries q
    WHERE q.id = query_answers.query_id
  )
);

-- Create policy for users to view answers to allowed queries
DROP POLICY IF EXISTS "Users can view answers to allowed queries" ON public.query_answers;
CREATE POLICY "Users can view answers to allowed queries"
ON public.query_answers
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'faculty') OR
  EXISTS (
    SELECT 1 
    FROM queries q
    JOIN profiles p ON p.user_id = auth.uid()
    WHERE q.id = query_answers.query_id
    AND (q.author_class = p.section)
  )
);