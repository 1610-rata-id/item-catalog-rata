import { createClient } from "@supabase/supabase-js";
import ItemDetail from "./components/ItemDetail";

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
  const { slug } = await params;

  const { data } = await supabase
    .from("items")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) {
    return {
      title: "Item Not Found",
    };
  }

  return {
    title: data.item_name,

    description: data.description,

    openGraph: {
      title: data.item_name,
      description: data.description,
      images: [data.image_url],
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
  const { slug } = await params;

  const { data } = await supabase
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

  return <ItemDetail data={data} />;
}