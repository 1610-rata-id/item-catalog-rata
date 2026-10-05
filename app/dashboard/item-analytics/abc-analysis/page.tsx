import ItemAbcFilter from "@/components/analytics/item-abc/ItemAbcFilter";
import ItemAbcHeader from "@/components/analytics/item-abc/ItemAbcHeader";
import ItemAbcPage from "@/components/analytics/item-abc/page";
import { Suspense } from "react";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-[1600px] px-8 py-10">
        <ItemAbcHeader />

        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading ABC Analysis...
              </p>
            </div>
          }
        >
          <ItemAbcFilter />

          <ItemAbcPage />
        </Suspense>
      </div>
    </main>
  );
}