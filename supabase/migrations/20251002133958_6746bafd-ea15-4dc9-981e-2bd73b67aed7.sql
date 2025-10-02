-- Fix query_answers policy that still references profiles.role
DROP POLICY IF EXISTS "Users can create answers to allowed queries" ON public.query_answers;

CREATE POLICY "Users can create answers to allowed queries"
ON public.query_answers
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM queries q
    JOIN profiles p ON p.user_id = auth.uid()
    WHERE q.id = query_answers.query_id
    AND (
      has_role(auth.uid(), 'faculty'::app_role) OR
      q.author_class = p.section
    )
  )
);

-- Now drop the role column from profiles (CASCADE to drop dependent objects)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role CASCADE;

-- Update the handle_new_user trigger to NOT insert role into profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table (without role)
  INSERT INTO public.profiles (user_id, name, sapid, department, year, section)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'sapid', ''),
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'year',
    NEW.raw_user_meta_data->>'section'
  );

  -- Insert default role into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student'::app_role);

  RETURN NEW;
END;
$$;