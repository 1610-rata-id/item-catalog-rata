import { Transaction } from "@/types/transaction";

function parseNumber(value: string | undefined): number {
  if (!value) return 0;

  return Number(
    value
      .replace(/Rp/g, "")
      .replace(/,/g, "")
      .replace(/\s/g, "")
  ) || 0;
}

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;

  const date = new Date(value);

  if (isNaN(date.getTime())) return undefined;

  return date;
}

function createBusinessKey(row: Record<string, string>): string {
  return [
    row["ID PR"] ?? "",
    row["Item Name"] ?? "",
    row["Order Date"] ?? "",
  ].join("|");
}

export function transformTransaction(
  row: Record<string, string>
): Transaction {

  return {

    businessKey: createBusinessKey(row),

    milestonePr: row["Milestone PR"] ?? "",

    prNumber: row["ID PR"] ?? "",

    poNumber: row["PO Number"] ?? "",

    orderDate: parseDate(row["Order Date"]),

    vendorName: row["Vendor Name"] ?? "",

    itemCode: row["Item Code"] ?? "",

    itemName: row["Item Name"] ?? "",

    qty: parseNumber(row["Quantity"]),

    uom: row["Unit"] ?? "",

    unitPrice: parseNumber(row["Price Per Unit"]),

    totalPrice: parseNumber(row["Total Price PO"]),

    qcfName: row["QCF Name"] ?? "",

    receiveDate: parseDate(row["Receive Date"]),

    paymentRequestId: row["Payment Request ID"] ?? "",

  };

}