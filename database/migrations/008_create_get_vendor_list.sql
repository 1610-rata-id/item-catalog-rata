DROP FUNCTION IF EXISTS get_vendor_list(integer);

CREATE OR REPLACE FUNCTION get_vendor_list(
    p_year integer
)
RETURNS TABLE (
    vendor_name text
)
LANGUAGE sql
STABLE
AS $$
    SELECT DISTINCT
        vendor_name
    FROM procurement_transactions
    WHERE
        vendor_name IS NOT NULL
        AND vendor_name <> ''
        AND EXTRACT(YEAR FROM order_date) = p_year
    ORDER BY vendor_name;
$$;