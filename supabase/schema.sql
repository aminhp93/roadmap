-- ========================================================
-- SUPABASE DATABASE SCHEMA FOR ROADMAP-VIZ APPLICATION
-- Run this script in Supabase SQL Editor (https://supabase.com/dashboard)
-- ========================================================

-- 1. Create User Node Progress Table
CREATE TABLE IF NOT EXISTS public.user_node_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default_user',
  node_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'skipped', 'pending')),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, node_id)
);

-- 2. Create Daily Task Logs Table
CREATE TABLE IF NOT EXISTS public.daily_task_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default_user',
  roadmap_id TEXT NOT NULL,
  task_text TEXT NOT NULL,
  hours_spent NUMERIC,
  alignment_status TEXT NOT NULL CHECK (alignment_status IN ('aligned', 'off-track')),
  matched_node_id TEXT,
  matched_node_title TEXT,
  feedback_message TEXT,
  gap_item_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2b. Idempotent column add for existing databases created before gap_item_id existed
ALTER TABLE public.daily_task_logs ADD COLUMN IF NOT EXISTS gap_item_id TEXT;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_task_logs ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies (Allow Anonymous & Authenticated Read/Write for Personal Mode)
CREATE POLICY "Allow public read user_node_progress"
  ON public.user_node_progress FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update user_node_progress"
  ON public.user_node_progress FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read daily_task_logs"
  ON public.daily_task_logs FOR SELECT USING (true);

CREATE POLICY "Allow public insert/delete daily_task_logs"
  ON public.daily_task_logs FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_node_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_task_logs;
