import { TransactionRepository } from "./transaction-repository";
import { Transaction } from "@/types/transaction";
import { AnalyticsFilter } from "@/types/filters";

import { fetchTransactions } from "@/services/google-sheets-api";
import { mapTransaction } from "./mappers/transaction-mapper";

export class GoogleSheetsTransactionRepository
  implements TransactionRepository
{
  async getTransactions(
    filter?: AnalyticsFilter
  ): Promise<Transaction[]> {

    const result = await fetchTransactions();

    const transactions = result.data.map(mapTransaction);

    return transactions;
  }
}