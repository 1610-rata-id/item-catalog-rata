CREATE OR REPLACE VIEW dashboard_overview AS
SELECT
    COALESCE(SUM(total_price), 0) AS total_spend,
    COUNT(*) AS total_transactions,
    COUNT(DISTINCT vendor_name) AS active_vendors,
    COUNT(DISTINCT item_code) AS purchased_items
FROM procurement_transactions;