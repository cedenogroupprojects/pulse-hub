-- Run this entire file in your Supabase SQL editor

-- Verticals
create table if not exists verticals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  leader_name text,
  leader_avatar_url text,
  manager_name text,
  manager_avatar_url text,
  tool_url text,
  status text default 'building',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Leadership team
create table if not exists leadership_team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  avatar_url text,
  verticals text[],
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Motivational quotes
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  attribution text,
  active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ZERO chat messages
create table if not exists zero_messages (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table verticals enable row level security;
alter table leadership_team enable row level security;
alter table quotes enable row level security;
alter table zero_messages enable row level security;

-- RLS Policies (allow authenticated users to read all, service role handles writes)
create policy "Public read verticals" on verticals for select using (true);
create policy "Public read leadership" on leadership_team for select using (true);
create policy "Public read quotes" on quotes for select using (true);
create policy "Users read own messages" on zero_messages for select using (true);
create policy "Users insert own messages" on zero_messages for insert with check (true);

-- Allow all ops for service role (used by Vercel serverless functions)
create policy "Service role all verticals" on verticals using (auth.role() = 'service_role');
create policy "Service role all leadership" on leadership_team using (auth.role() = 'service_role');
create policy "Service role all quotes" on quotes using (auth.role() = 'service_role');

-- Seed quotes
insert into quotes (quote, attribution, active, sort_order) values
  ('You don''t rise to the level of your goals. You fall to the level of your systems.', 'James Clear', true, 0),
  ('The scoreboard doesn''t lie. Build the machine, then let it run.', 'Jeffry Giordano', true, 1),
  ('Leadership is not about being in charge. It is about taking care of those in your charge.', 'Simon Sinek', true, 2),
  ('Speed is irrelevant if you are going in the wrong direction.', 'Mahatma Gandhi', true, 3),
  ('We are what we repeatedly do. Excellence, then, is not an act but a habit.', 'Aristotle', true, 4),
  ('Don''t watch the clock; do what it does. Keep going.', 'Sam Levenson', true, 5),
  ('A small team of A+ players can run circles around a giant team of B and C players.', 'Steve Jobs', true, 6)
on conflict do nothing;

-- Seed verticals
insert into verticals (name, description, leader_name, manager_name, status, sort_order) values
  ('Ads & VA Services', 'White-label VA placement and media services for agents', 'Reyes Abalos', 'Ramon', 'active', 0),
  ('Landscaping', 'Landscaping vertical business', 'Jeffry Giordano', 'Jeffry Giordano', 'building', 1),
  ('Lending', 'Mortgage and lending services', 'Robert Cedeño', 'Robert Cedeño', 'active', 2),
  ('Insurance', 'Life and health insurance, GFI downline', 'Robert Cedeño', 'Robert Cedeño', 'active', 3),
  ('Agent Coaching', 'Coaching program for real estate agents', 'Alex Tait', 'Alex Tait', 'active', 4),
  ('Downline / Team Building', 'Recruiting and team growth across verticals', 'Jeffry Giordano', 'Jeffry Giordano', 'building', 5)
on conflict do nothing;

-- Seed leadership team
insert into leadership_team (name, title, verticals, sort_order) values
  ('Jeffry Giordano', 'COO / Team Leader', ARRAY['All Verticals'], 0),
  ('Robert Cedeño', 'CEO', ARRAY['Real Estate Team', 'Coaching'], 1),
  ('Alex Tait', 'Director of Operations', ARRAY['Agent Coaching', 'Onboarding'], 2),
  ('Reyes Abalos', 'Marketing & Sales Director', ARRAY['Ads & VA Services', 'Content'], 3)
on conflict do nothing;
