import { Transaction } from "@/types/transaction";
import { SHEET_COLUMNS } from "@/constants/sheet-columns";

export function mapTransaction(
  row: Record<string, any>
): Transaction {
  const poNumber =
    row[SHEET_COLUMNS.poNumber] ?? "";

  const prNumber =
    row[SHEET_COLUMNS.prNumber] ?? "";

  const itemCode =
    row[SHEET_COLUMNS.itemCode] ?? "";

  return {
    id: crypto.randomUUID(),

    businessKey: `${poNumber}-${itemCode}`,

    milestonePr: "",

    prNumber,

    poNumber,

    orderDate: row[SHEET_COLUMNS.orderDate]
      ? new Date(row[SHEET_COLUMNS.orderDate])
      : undefined,

    vendorName:
      row[SHEET_COLUMNS.vendor] ?? "",

    itemCode,

    itemName:
      row[SHEET_COLUMNS.itemName] ?? "",

    qty: Number(
      row[SHEET_COLUMNS.qty] ?? 0
    ),

    uom:
      row[SHEET_COLUMNS.uom] ?? "",

    unitPrice: Number(
      row[SHEET_COLUMNS.unitPrice] ?? 0
    ),

    totalPrice: Number(
      row[SHEET_COLUMNS.totalPrice] ?? 0
    ),
  };
}