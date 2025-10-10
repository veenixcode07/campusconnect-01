-- Create a function to get email by SAPID for login
CREATE OR REPLACE FUNCTION public.get_email_by_sapid(input_sapid TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT au.email
  INTO user_email
  FROM public.profiles p
  JOIN auth.users au ON au.id = p.user_id
  WHERE p.sapid = input_sapid
  LIMIT 1;
  
  RETURN user_email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_email_by_sapid(TEXT) TO authenticated;