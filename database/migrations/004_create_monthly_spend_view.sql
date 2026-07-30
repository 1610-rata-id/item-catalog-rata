CREATE OR REPLACE VIEW public.monthly_spend AS
SELECT
    EXTRACT(YEAR FROM order_date)::int AS year,
    EXTRACT(MONTH FROM order_date)::int AS month,
    TO_CHAR(order_date, 'Mon') AS month_name,
    SUM(total_price) AS total_spend
FROM procurement_transactions
WHERE order_date IS NOT NULL
GROUP BY
    EXTRACT(YEAR FROM order_date),
    EXTRACT(MONTH FROM order_date),
    TO_CHAR(order_date, 'Mon')
ORDER BY
    year,
    month;