export interface Transaction {
  id: string;

  poNumber: string;
  prNumber?: string;

  orderDate: Date;

  vendor: string;

  itemCode: string;
  itemName: string;

  qty: number;
  uom: string;

  unitPrice: number;
  totalPrice: number;

  // Future:
  // requestor
  // department
  // approvalStatus
  // receiveDate
  // podStatus
  // paymentId
}