-- Provider Success Stories — calls table
-- Run once in Supabase SQL Editor or via Supabase CLI

create table if not exists calls (
  id                          uuid        primary key default gen_random_uuid(),
  retell_call_id              text        unique not null,
  from_number                 text,
  to_number                   text,
  start_time                  timestamptz,
  end_time                    timestamptz,
  duration_seconds            int,
  status                      text,
  transcript                  jsonb,      -- [{role: "agent"|"user", content: "..."}]

  -- Post-call analysis
  call_summary                text,
  call_successful             boolean,
  user_sentiment              text,       -- "Positive" | "Neutral" | "Negative"
  clinical_case_description   text,
  value_delivered             text,
  type_of_service             text,
  service_type_classification text[],     -- multi-value array
  provider_full_name          text,

  -- Trouble indicators
  disconnection_reason        text,
  who_hung_up                 text,       -- "agent" | "user" | "unknown"

  -- Catch-all for any extra Retell analysis fields added in the future
  raw_analysis                jsonb,

  created_at                  timestamptz default now()
);

-- Indexes for common filter patterns
create index if not exists idx_calls_start_time    on calls (start_time desc);
create index if not exists idx_calls_from_number   on calls (from_number);
create index if not exists idx_calls_successful    on calls (call_successful);
create index if not exists idx_calls_sentiment     on calls (user_sentiment);
create index if not exists idx_calls_provider      on calls (provider_full_name);
create index if not exists idx_calls_service_type  on calls using gin (service_type_classification);

-- Row Level Security: authenticated users can read all rows
-- The webhook uses the service role key and bypasses RLS automatically
alter table calls enable row level security;

create policy "Authenticated users can read calls"
  on calls for select
  to authenticated
  using (true);
