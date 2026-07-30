-- Tambahkan kolom natural key
ALTER TABLE public.procurement_transactions
ADD COLUMN IF NOT EXISTS sub_pr_id text;

-- Karena tabel sudah kosong, kita bisa langsung menjadikannya wajib
ALTER TABLE public.procurement_transactions
ALTER COLUMN sub_pr_id SET NOT NULL;

-- Tambahkan UNIQUE constraint untuk UPSERT
ALTER TABLE public.procurement_transactions
ADD CONSTRAINT procurement_transactions_sub_pr_id_key
UNIQUE (sub_pr_id);

-- Index untuk mempercepat query dashboard
CREATE INDEX IF NOT EXISTS idx_procurement_pr_number
ON public.procurement_transactions(pr_number);

CREATE INDEX IF NOT EXISTS idx_procurement_po_number
ON public.procurement_transactions(po_number);

CREATE INDEX IF NOT EXISTS idx_procurement_vendor_name
ON public.procurement_transactions(vendor_name);

CREATE INDEX IF NOT EXISTS idx_procurement_order_date
ON public.procurement_transactions(order_date);