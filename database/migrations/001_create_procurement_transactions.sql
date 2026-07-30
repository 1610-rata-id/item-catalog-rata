create table if not exists public.procurement_transactions (

    id uuid primary key default gen_random_uuid(),

    milestone_pr text,

    pr_number text not null,

    po_number text,

    order_date date,

    vendor_name text,

    item_code text,

    item_name text not null,

    qty numeric,

    uom text,

    unit_price numeric,

    total_price numeric,

    qcf_name text,

    receive_date date,

    payment_request_id text,

    synced_at timestamptz default now(),

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);