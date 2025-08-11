-- Create students table for tracking core student info
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sapid TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  section TEXT,
  email TEXT,
  phone TEXT,
  average_grade NUMERIC,
  attendance_percentage NUMERIC,
  status TEXT,
  trend TEXT,
  last_activity TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Update updated_at automatically
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies for students table
-- Faculty/Admin can manage all rows
CREATE POLICY "Faculty and admin can manage students"
ON public.students
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('faculty','admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('faculty','admin')
  )
);

-- Students can view their own row
CREATE POLICY "Students can view their own student row"
ON public.students
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.sapid = students.sapid
  )
);

-- Create subject-wise attendance summary table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  total_classes INTEGER NOT NULL DEFAULT 0,
  attended_classes INTEGER NOT NULL DEFAULT 0,
  recent_pattern TEXT[] NOT NULL DEFAULT '{}'::text[],
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_subject_per_student UNIQUE (student_id, subject)
);

CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON public.attendance_records(student_id);

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_attendance_records_updated_at
BEFORE UPDATE ON public.attendance_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies for attendance_records
-- Faculty/Admin can manage all
CREATE POLICY "Faculty and admin can manage attendance records"
ON public.attendance_records
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('faculty','admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('faculty','admin')
  )
);

-- Students can view their own attendance records
CREATE POLICY "Students can view their own attendance records"
ON public.attendance_records
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.profiles p ON p.user_id = auth.uid()
    WHERE s.id = attendance_records.student_id
      AND p.sapid = s.sapid
  )
);

-- Create daily attendance logs table
CREATE TABLE IF NOT EXISTS public.attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  subject TEXT NOT NULL,
  present BOOLEAN NOT NULL DEFAULT false,
  time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attendance_logs_student_date ON public.attendance_logs(student_id, log_date);

ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_attendance_logs_updated_at
BEFORE UPDATE ON public.attendance_logs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies for attendance_logs
-- Faculty/Admin can manage all
CREATE POLICY "Faculty and admin can manage attendance logs"
ON public.attendance_logs
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('faculty','admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('faculty','admin')
  )
);

-- Students can view their own attendance logs
CREATE POLICY "Students can view their own attendance logs"
ON public.attendance_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.profiles p ON p.user_id = auth.uid()
    WHERE s.id = attendance_logs.student_id
      AND p.sapid = s.sapid
  )
);

-- Realtime configuration
ALTER TABLE public.students REPLICA IDENTITY FULL;
ALTER TABLE public.attendance_records REPLICA IDENTITY FULL;
ALTER TABLE public.attendance_logs REPLICA IDENTITY FULL;

-- Add tables to the realtime publication
DO $$
BEGIN
  -- If publication doesn't exist, this will raise; assume it exists in Supabase projects
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.students';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_logs';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;