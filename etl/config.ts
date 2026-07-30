export const ETL_CONFIG = {
  batchSize: Number(process.env.ETL_BATCH_SIZE ?? 1000),

  dryRun: process.env.ETL_DRY_RUN === "true",

  reportDirectory:
    process.env.ETL_REPORT_DIRECTORY ?? "reports",

  tableName:
    process.env.ETL_TABLE_NAME ?? "procurement_transactions",
};