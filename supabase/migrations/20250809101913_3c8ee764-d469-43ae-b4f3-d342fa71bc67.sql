-- 1) Create queries tables for persistent Query Forum
create table if not exists public.queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  content text not null,
  subject text not null,
  author text,
  author_class text,
  likes integer not null default 0,
  liked_by text[] not null default '{}'::text[],
  replies integer not null default 0,
  solved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.queries enable row level security;

-- View queries: faculty can view all; others only their class
create policy if not exists "Users can view class-allowed queries"
  on public.queries
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid()
        and (p.role = 'faculty' or p.section = public.queries.author_class)
    )
  );

-- Insert queries: only authenticated users; enforce ownership
create policy if not exists "Users can create their own queries"
  on public.queries
  for insert
  with check (
    user_id = auth.uid() and exists (
      select 1 from public.profiles p where p.user_id = auth.uid()
    )
  );

-- Update/Delete by owner
create policy if not exists "Authors can update their own queries"
  on public.queries
  for update
  using (auth.uid() = user_id);

create policy if not exists "Authors can delete their own queries"
  on public.queries
  for delete
  using (auth.uid() = user_id);

-- Trigger to maintain updated_at
create trigger if not exists update_queries_updated_at
before update on public.queries
for each row execute function public.update_updated_at_column();

-- 2) Answers table
create table if not exists public.query_answers (
  id uuid primary key default gen_random_uuid(),
  query_id uuid not null references public.queries(id) on delete cascade,
  user_id uuid not null,
  content text not null,
  author text,
  author_role text,
  is_accepted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.query_answers enable row level security;

-- View answers: same visibility as their parent query
create policy if not exists "Users can view answers to allowed queries"
  on public.query_answers
  for select
  using (
    exists (
      select 1
      from public.queries q
      join public.profiles p on p.user_id = auth.uid()
      where q.id = public.query_answers.query_id
        and (p.role = 'faculty' or q.author_class = p.section)
    )
  );

-- Insert answers: authenticated, and must have access to parent query
create policy if not exists "Users can create answers to allowed queries"
  on public.query_answers
  for insert
  with check (
    user_id = auth.uid() and exists (
      select 1
      from public.queries q
      join public.profiles p on p.user_id = auth.uid()
      where q.id = public.query_answers.query_id
        and (p.role = 'faculty' or q.author_class = p.section)
    )
  );

-- Update answers: owner or faculty
create policy if not exists "Answer authors can update their answers"
  on public.query_answers
  for update
  using (auth.uid() = user_id);

create policy if not exists "Faculty can update answers in their classes"
  on public.query_answers
  for update
  using (
    exists (
      select 1
      from public.queries q
      join public.profiles p on p.user_id = auth.uid()
      where q.id = public.query_answers.query_id
        and p.role = 'faculty'
    )
  );

-- Delete answers: owner only
create policy if not exists "Answer authors can delete their answers"
  on public.query_answers
  for delete
  using (auth.uid() = user_id);

-- Trigger to maintain updated_at on answers
create trigger if not exists update_query_answers_updated_at
before update on public.query_answers
for each row execute function public.update_updated_at_column();

-- Helpful index
create index if not exists idx_query_answers_query_id on public.query_answers(query_id);

-- 3) Allow deletions where the UI already supports them
-- Assignments: allow creators to delete
create policy if not exists "Creators can delete their own assignments"
  on public.assignments
  for delete
  using (auth.uid() = created_by);

-- Notices: allow authors to delete
create policy if not exists "Authors can delete their own notices"
  on public.notices
  for delete
  using (auth.uid() = author_id);
