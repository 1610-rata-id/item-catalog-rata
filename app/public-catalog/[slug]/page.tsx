import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  const { data: item } = await supabase
    .from("public_items")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!item) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto p-10">

      <div className="grid md:grid-cols-2 gap-10">

        <div>

          <img
            src={item.image_url}
            className="
              w-full
              rounded-3xl
              bg-gray-100
              p-10
              object-contain
            "
          />

        </div>

        <div>

          <h1 className="text-4xl font-bold">
            {item.item_name}
          </h1>

          <p className="mt-3 text-gray-500">
            {item.category}
          </p>

          <div className="mt-10 space-y-3">

            <p>
              <b>Code:</b>{" "}
              {item.item_code || "-"}
            </p>

            <p>
              <b>UOM:</b>{" "}
              {item.UOM || "-"}
            </p>

          </div>

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
              Description
            </h2>

            <div className="whitespace-pre-line text-gray-700 leading-8">
              {item.description || "-"}
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}