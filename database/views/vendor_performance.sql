CREATE OR REPLACE VIEW vendor_performance AS
SELECT
    vendor_name,
    COUNT(*) AS total_transactions,
    SUM(total_price) AS total_spend
FROM procurement_transactions
WHERE vendor_name IS NOT NULL
  AND TRIM(vendor_name) <> ''
GROUP BY vendor_name
ORDER BY total_spend DESC;