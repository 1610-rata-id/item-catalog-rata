export interface ETLReport {
  startedAt: string;

  finishedAt: string;

  durationMs: number;

  total: number;

  valid: number;

  invalid: number;

  uploaded: number;

  batches: number;

  dryRun: boolean;

  errors: unknown[];
}