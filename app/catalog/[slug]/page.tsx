import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const { data } =
    await supabase
      .from("items")
      .select("*")
      .eq("slug", slug)
      .single();

  if (!data) {
    return {
      title:
        "Item Not Found",
    };
  }

  return {
    title:
      data.item_name,

    description:
      data.description,

    openGraph: {
      title:
        data.item_name,

      description:
        data.description,

      images: [
        data.image_url,
      ],
    },
  };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const { data } =
    await supabase
      .from("items")
      .select("*")
      .eq("slug", slug)
      .single();

  if (!data) {
    return (
      <main className="p-10">
        Item not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f7] p-10">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div>

          <Image
  src={data.image_url}
  alt={data.item_name}
  width={1000}
  height={1000}
  className="
    w-full
    rounded-3xl
    border
    bg-white
  "
/>

        </div>

        {/* INFO */}
        <div>

          <p className="text-gray-500 mb-3">
            {data.category}
          </p>

          <h1 className="text-5xl font-bold text-black mb-5">
            {data.item_name}
          </h1>

          <p className="text-2xl font-semibold text-green-600 mb-8">
            Rp{" "}
            {new Intl.NumberFormat(
              "id-ID"
            ).format(
              data.price || 0
            )}
          </p>

          <div className="space-y-4 text-gray-700">

            <p>
              <strong>
                Vendor:
              </strong>{" "}
              {data.vendor}
            </p>

            <p>
              <strong>
                Item Code:
              </strong>{" "}
              {data.item_code}
            </p>

            <p>
              <strong>
                Manufacture:
              </strong>{" "}
              {data.Manufacture}
            </p>

            <p>
              <strong>
                UOM:
              </strong>{" "}
              {data.UOM}
            </p>

            <p>
              <strong>
                Type:
              </strong>{" "}
              {data.type}
            </p>

          </div>

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4 text-black">
              Description
            </h2>

            <p className="text-gray-700 leading-8">
              {data.description}
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}