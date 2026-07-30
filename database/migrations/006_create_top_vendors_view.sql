CREATE OR REPLACE VIEW public.top_vendors AS
SELECT
    vendor_name,
    SUM(total_price) AS total_spend,
    COUNT(*) AS transaction_count,
    COUNT(DISTINCT item_code) AS unique_items
FROM public.procurement_transactions
WHERE
    vendor_name IS NOT NULL
    AND vendor_name <> ''
GROUP BY
    vendor_name
ORDER BY
    total_spend DESC;