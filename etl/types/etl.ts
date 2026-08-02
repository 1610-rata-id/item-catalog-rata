import { ProcurementRecord } from "./procurement";

export interface ETLResult {
  total: number;
  valid: number;
  invalid: number;

  errors: {
    record: ProcurementRecord;
    errors: string[];
  }[];

  load: {
    total: number;
    batches?: number;
    dryRun: boolean;
  };

  reportPath: string;
}