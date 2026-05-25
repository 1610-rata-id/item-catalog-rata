import { Suspense } from "react";
import PublicCatalogClient from "./PublicCatalogClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PublicCatalogClient />
    </Suspense>
  );
}