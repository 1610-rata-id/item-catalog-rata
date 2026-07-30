export interface SyncResult {

  totalRows: number;

  validRows: number;

  invalidRows: number;

  insertedRows: number;

  failedRows: number;

  totalBatches: number;

  success: boolean;

  durationMs: number;

  errors: string[];

}