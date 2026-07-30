create or replace function public.get_procurement_overview(
    p_year integer,
    p_month integer default null,
    p_vendor text default null,
    p_search text default null
)
returns table (
    total_spend numeric,
    total_vendors bigint,
    total_purchase_requests bigint,
    total_purchase_orders bigint,
    total_transactions bigint
)
language sql
stable
as
$$
select
    coalesce(sum(total_price), 0) as total_spend,
    count(distinct vendor_name) as total_vendors,
    count(distinct pr_number) as total_purchase_requests,
    count(distinct po_number) as total_purchase_orders,
    count(*) as total_transactions
from public.procurement_transactions
where
    extract(year from order_date) = p_year
    and (
        p_month is null
        or extract(month from order_date) = p_month
    )
    and (
        p_vendor is null
        or vendor_name = p_vendor
    )
    and (
        p_search is null
        or p_search = ''
        or item_name ilike '%' || p_search || '%'
        or item_code ilike '%' || p_search || '%'
        or vendor_name ilike '%' || p_search || '%'
        or po_number ilike '%' || p_search || '%'
        or pr_number ilike '%' || p_search || '%'
    );
$$;


create or replace function public.get_vendor_performance(
    p_year integer,
    p_month integer default null,
    p_vendor text default null,
    p_search text default null,
    p_limit integer default 10
)
returns table (
    vendor_name text,
    total_spend numeric,
    total_qty numeric,
    total_purchase_orders bigint,
    total_purchase_requests bigint,
    transaction_count bigint,
    unique_items bigint
)
language sql
stable
as
$$
select
    vendor_name,
    coalesce(sum(total_price), 0) as total_spend,
    coalesce(sum(qty), 0) as total_qty,
    count(distinct po_number) as total_purchase_orders,
    count(distinct pr_number) as total_purchase_requests,
    count(*) as transaction_count,
    count(distinct item_code) as unique_items
from public.procurement_transactions
where
    extract(year from order_date) = p_year
    and (
        p_month is null
        or extract(month from order_date) = p_month
    )
    and (
        p_vendor is null
        or vendor_name = p_vendor
    )
    and (
        p_search is null
        or p_search = ''
        or item_name ilike '%' || p_search || '%'
        or item_code ilike '%' || p_search || '%'
        or vendor_name ilike '%' || p_search || '%'
        or po_number ilike '%' || p_search || '%'
        or pr_number ilike '%' || p_search || '%'
    )
group by
    vendor_name
order by
    total_spend desc
limit p_limit;
$$;

create or replace function public.get_top_spend_items(
    p_year integer,
    p_month integer default null,
    p_vendor text default null,
    p_search text default null,
    p_limit integer default 10
)
returns table (
    item_code text,
    item_name text,
    total_spend numeric,
    total_qty numeric,
    transaction_count bigint
)
language sql
stable
as
$$
select
    item_code,
    item_name,
    coalesce(sum(total_price), 0) as total_spend,
    coalesce(sum(qty), 0) as total_qty,
    count(*) as transaction_count
from public.procurement_transactions
where
    extract(year from order_date) = p_year
    and (
        p_month is null
        or extract(month from order_date) = p_month
    )
    and (
        p_vendor is null
        or vendor_name = p_vendor
    )
    and (
        p_search is null
        or p_search = ''
        or item_name ilike '%' || p_search || '%'
        or item_code ilike '%' || p_search || '%'
        or vendor_name ilike '%' || p_search || '%'
        or po_number ilike '%' || p_search || '%'
        or pr_number ilike '%' || p_search || '%'
    )
group by
    item_code,
    item_name
order by
    total_spend desc
limit p_limit;
$$;
create or replace function public.get_monthly_spend(
    p_year integer,
    p_month integer default null,
    p_vendor text default null,
    p_search text default null
)
returns table (
    year integer,
    month integer,
    month_name text,
    total_spend numeric
)
language sql
stable
as
$$
select
    extract(year from order_date)::int as year,
    extract(month from order_date)::int as month,
    trim(to_char(order_date, 'Mon')) as month_name,
    coalesce(sum(total_price), 0) as total_spend
from public.procurement_transactions
where
    extract(year from order_date) = p_year
    and (
        p_month is null
        or extract(month from order_date) = p_month
    )
    and (
        p_vendor is null
        or vendor_name = p_vendor
    )
    and (
        p_search is null
        or p_search = ''
        or item_name ilike '%' || p_search || '%'
        or item_code ilike '%' || p_search || '%'
        or vendor_name ilike '%' || p_search || '%'
        or po_number ilike '%' || p_search || '%'
        or pr_number ilike '%' || p_search || '%'
    )
group by
    extract(year from order_date),
    extract(month from order_date),
    trim(to_char(order_date, 'Mon'))
order by month;
$$;

create or replace function public.get_recent_transactions(
    p_year integer,
    p_month integer default null,
    p_vendor text default null,
    p_search text default null,
    p_limit integer default 10
)
returns table (
    order_date date,
    vendor_name text,
    item_name text,
    uom text,
    qty numeric,
    total_price numeric,
    po_number text,
    pr_number text
)
language sql
stable
as
$$
select
    order_date,
    vendor_name,
    item_name,
    uom,
    qty,
    total_price,
    po_number,
    pr_number
from public.procurement_transactions
where
    extract(year from order_date) = p_year
    and (
        p_month is null
        or extract(month from order_date) = p_month
    )
    and (
        p_vendor is null
        or vendor_name = p_vendor
    )
    and (
        p_search is null
        or p_search = ''
        or item_name ilike '%' || p_search || '%'
        or item_code ilike '%' || p_search || '%'
        or vendor_name ilike '%' || p_search || '%'
        or po_number ilike '%' || p_search || '%'
        or pr_number ilike '%' || p_search || '%'
    )
order by
    order_date desc,
    po_number desc,
    item_name asc
limit p_limit;
$$;