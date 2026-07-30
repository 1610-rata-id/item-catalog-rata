import {
  formatCompactCurrency,
  formatNumber,
} from "@/lib/format";

export default function TopSpendItemsTooltip({
  active,
  payload,
}: any) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="font-medium mb-2">
        {item.item_name}
      </p>

      <div className="space-y-1 text-sm">
        <p>
          Spend: {formatCompactCurrency(item.total_spend)}
        </p>

        <p>
          Qty: {formatNumber(item.total_qty)}
        </p>

        <p>
          Transactions: {formatNumber(item.transaction_count)}
        </p>
      </div>
    </div>
  );
}