CREATE OR REPLACE VIEW public.top_spend_items AS
SELECT
    item_code,
    item_name,
    SUM(total_price) AS total_spend,
    SUM(qty) AS total_qty,
    COUNT(*) AS transaction_count
FROM public.procurement_transactions
WHERE
    item_name IS NOT NULL
    AND item_code NOT LIKE 'SVC%'
GROUP BY
    item_code,
    item_name
ORDER BY
    total_spend DESC;