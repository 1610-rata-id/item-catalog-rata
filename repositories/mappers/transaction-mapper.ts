import { Transaction } from "@/types/transaction";
import { SHEET_COLUMNS } from "@/constants/sheet-columns";

export function mapTransaction(
  row: Record<string, any>
): Transaction {
  return {
    id: crypto.randomUUID(),

    poNumber: row[SHEET_COLUMNS.poNumber],
    prNumber: row[SHEET_COLUMNS.prNumber] || undefined,

    orderDate: new Date(row[SHEET_COLUMNS.orderDate]),

    vendor: row[SHEET_COLUMNS.vendor],

    itemCode: row[SHEET_COLUMNS.itemCode],
    itemName: row[SHEET_COLUMNS.itemName],

    qty: Number(row[SHEET_COLUMNS.qty]),
    uom: row[SHEET_COLUMNS.uom],

    unitPrice: Number(row[SHEET_COLUMNS.unitPrice]),
    totalPrice: Number(row[SHEET_COLUMNS.totalPrice]),
  };
}