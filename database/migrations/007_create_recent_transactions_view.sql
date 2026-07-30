CREATE OR REPLACE VIEW public.recent_transactions AS
SELECT
    id,
    order_date,
    vendor_name,
    item_name,
    qty,
    total_price
FROM public.procurement_transactions
WHERE order_date IS NOT NULL
ORDER BY
    order_date DESC,
    id DESC;