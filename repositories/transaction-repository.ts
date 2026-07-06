import { AnalyticsFilter } from "@/types/filters";
import { Transaction } from "@/types/transaction";

export interface TransactionRepository {
  getTransactions(
    filter?: AnalyticsFilter
  ): Promise<Transaction[]>;
}