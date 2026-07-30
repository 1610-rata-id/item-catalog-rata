import { previewTransactions } from "@/sync/services/sync-preview-service";

export default async function SyncTestPage() {
  const result = await previewTransactions();

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">
        Procurement Sync Preview
      </h1>

      <div className="space-y-2">
        <p>Total CSV Rows : {result.totalRows}</p>
        <p>Valid Rows : {result.validRows}</p>
        <p>Invalid Rows : {result.invalidRows}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">
          First Valid Transaction
        </h2>

        <pre className="overflow-auto rounded bg-black-100 p-4 text-sm">
          {JSON.stringify(result.validTransactions[0], null, 2)}
        </pre>
      </div>

      {result.errors.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Validation Errors (First 20)
          </h2>

          <pre className="overflow-auto rounded bg-black-100 p-4 text-sm">
            {JSON.stringify(result.errors.slice(0, 20), null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}