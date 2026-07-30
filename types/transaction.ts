export interface Transaction {
  id?: string;

  businessKey: string;

  milestonePr: string;

  prNumber: string;

  poNumber?: string;

  orderDate?: Date;

  vendorName: string;

  itemCode: string;

  itemName: string;

  qty: number;

  uom: string;

  unitPrice: number;

  totalPrice: number;

  qcfName?: string;

  receiveDate?: Date;

  paymentRequestId?: string;
}