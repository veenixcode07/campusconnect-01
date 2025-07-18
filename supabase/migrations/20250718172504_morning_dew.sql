/*
  # Initial Campus Connect Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text, check constraint)
      - `department` (text, optional)
      - `year` (text, optional)
      - `sapid` (text, optional, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `notices`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author` (text)
      - `department` (text)
      - `subject` (text, optional)
      - `category` (text, check constraint)
      - `pinned` (boolean, default false)
      - `pinned_until` (timestamp, optional)
      - `attachments` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `assignments`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `subject` (text)
      - `due_date` (date)
      - `author` (text)
      - `author_role` (text, check constraint)
      - `attachments` (text array)
      - `class_targets` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text, check constraint)
      - `subject` (text)
      - `uploaded_by` (text)
      - `size` (text)
      - `downloads` (integer, default 0)
      - `likes` (integer, default 0)
      - `tags` (text array)
      - `file_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `queries`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author` (text)
      - `subject` (text)
      - `replies` (integer, default 0)
      - `likes` (integer, default 0)
      - `solved` (boolean, default false)
      - `liked_by` (text array, default '{}')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `answers`
      - `id` (uuid, primary key)
      - `query_id` (uuid, references queries)
      - `content` (text)
      - `author` (text)
      - `author_role` (text, check constraint)
      - `is_accepted` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `student_notes`
      - `id` (uuid, primary key)
      - `student_id` (text)
      - `note` (text)
      - `author` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'admin', 'faculty')),
  department text,
  year text,
  sapid text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notices table
CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  department text NOT NULL,
  subject text,
  category text NOT NULL CHECK (category IN ('general', 'exam', 'urgent')),
  pinned boolean DEFAULT false,
  pinned_until timestamptz,
  attachments text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  subject text NOT NULL,
  due_date date NOT NULL,
  author text NOT NULL,
  author_role text NOT NULL CHECK (author_role IN ('faculty', 'admin')),
  attachments text[] DEFAULT '{}',
  class_targets text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('pdf', 'ppt', 'doc', 'video', 'image', 'other')),
  subject text NOT NULL,
  uploaded_by text NOT NULL,
  size text NOT NULL,
  downloads integer DEFAULT 0,
  likes integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  file_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create queries table
CREATE TABLE IF NOT EXISTS queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  subject text NOT NULL,
  replies integer DEFAULT 0,
  likes integer DEFAULT 0,
  solved boolean DEFAULT false,
  liked_by text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id uuid NOT NULL REFERENCES queries(id) ON DELETE CASCADE,
  content text NOT NULL,
  author text NOT NULL,
  author_role text NOT NULL CHECK (author_role IN ('student', 'faculty', 'admin')),
  is_accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create student_notes table
CREATE TABLE IF NOT EXISTS student_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  note text NOT NULL,
  author text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_notes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Notices policies
CREATE POLICY "Anyone can read notices"
  ON notices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Faculty and admin can create notices"
  ON notices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Faculty and admin can update notices"
  ON notices
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('faculty', 'admin')
    )
  );

-- Assignments policies
CREATE POLICY "Anyone can read assignments"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Faculty and admin can create assignments"
  ON assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Authors can update their assignments"
  ON assignments
  FOR UPDATE
  TO authenticated
  USING (
    author = (SELECT name FROM profiles WHERE profiles.id = auth.uid())
  );

CREATE POLICY "Authors can delete their assignments"
  ON assignments
  FOR DELETE
  TO authenticated
  USING (
    author = (SELECT name FROM profiles WHERE profiles.id = auth.uid())
  );

-- Resources policies
CREATE POLICY "Anyone can read resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Faculty and admin can create resources"
  ON resources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Uploaders can delete their resources"
  ON resources
  FOR DELETE
  TO authenticated
  USING (
    uploaded_by = (SELECT name FROM profiles WHERE profiles.id = auth.uid())
  );

-- Queries policies
CREATE POLICY "Anyone can read queries"
  ON queries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create queries"
  ON queries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authors can update their queries"
  ON queries
  FOR UPDATE
  TO authenticated
  USING (
    author = (SELECT name FROM profiles WHERE profiles.id = auth.uid())
  );

CREATE POLICY "Authors can delete their queries"
  ON queries
  FOR DELETE
  TO authenticated
  USING (
    author = (SELECT name FROM profiles WHERE profiles.id = auth.uid())
  );

-- Answers policies
CREATE POLICY "Anyone can read answers"
  ON answers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create answers"
  ON answers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Faculty can update answers"
  ON answers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'faculty'
    )
  );

-- Student notes policies
CREATE POLICY "Faculty can read all student notes"
  ON student_notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'faculty'
    )
  );

CREATE POLICY "Faculty can create student notes"
  ON student_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'faculty'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_queries_updated_at BEFORE UPDATE ON queries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_notes_updated_at BEFORE UPDATE ON student_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();