-- daily_briefs table
create table if not exists public.daily_briefs (
  id uuid primary key default gen_random_uuid(),
  generated_for date not null,
  session_type text not null,
  title text not null,
  summary text not null,
  regime text not null,
  ai_confidence integer not null default 70,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- daily_brief_sections table
create table if not exists public.daily_brief_sections (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid references public.daily_briefs(id) on delete cascade not null,
  section_type text not null,
  title text not null,
  content text not null,
  severity text not null default 'info',
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb
);

-- RLS
alter table public.daily_briefs enable row level security;
alter table public.daily_brief_sections enable row level security;

create policy "Authenticated users can read daily_briefs"
  on public.daily_briefs for select to authenticated using (true);

create policy "Authenticated users can insert daily_briefs"
  on public.daily_briefs for insert to authenticated with check (true);

create policy "Authenticated users can read daily_brief_sections"
  on public.daily_brief_sections for select to authenticated using (true);

create policy "Authenticated users can insert daily_brief_sections"
  on public.daily_brief_sections for insert to authenticated with check (true);

-- indexes
create index if not exists daily_briefs_generated_for_idx on public.daily_briefs(generated_for desc);
create index if not exists daily_briefs_session_type_idx on public.daily_briefs(session_type);
create index if not exists daily_brief_sections_brief_id_idx on public.daily_brief_sections(brief_id);
