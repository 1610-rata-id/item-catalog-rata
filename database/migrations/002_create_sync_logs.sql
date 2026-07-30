create table if not exists public.sync_logs (

    id uuid primary key default gen_random_uuid(),

    started_at timestamptz not null,

    finished_at timestamptz,

    total_rows integer default 0,

    status text not null,

    error_message text,

    created_at timestamptz default now()

);