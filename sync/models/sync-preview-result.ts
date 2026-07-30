import { Transaction } from "@/types/transaction";

export interface SyncPreviewResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  validTransactions: Transaction[];
  errors: string[];
}