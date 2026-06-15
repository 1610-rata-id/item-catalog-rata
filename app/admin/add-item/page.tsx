"use client";

import Image from "next/image";
import { useState } from "react";
import { createAuditLog } from "@/lib/audit";
import { supabase } from "@/lib/supabase";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ArrowLeft } from "lucide-react";

export default function AddItemPage() {
  const {
    loading: authLoading,
    role,
  } = useRequireAuth([
    "admin",
    "procurement",
  ]);

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    vendor: "",

    // NEW HIERARCHY
    main_category: "",
    sub_category: "",

    price: "",
    description: "",

    // MARKETPLACE URLS
    tokopedia_url: "",
    shopee_url: "",
    whatsapp_url: "",
    official_url: "",

    image_urls: [] as string[],
  });

  function handleChange(
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;

    if (!files || files.length === 0)
      return;

    setUploading(true);

    const uploadedUrls: string[] =
      [];

    for (const file of files) {

      const fileExt =
        file.name
          .split(".")
          .pop();

      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

      const filePath = `catalog/${fileName}`;

      const { error } =
        await supabase.storage
          .from("item-images")
          .upload(
            filePath,
            file
          );

      if (error) {
        alert(error.message);
        continue;
      }

      const { data } =
        supabase.storage
          .from("item-images")
          .getPublicUrl(
            filePath
          );

      uploadedUrls.push(
        data.publicUrl
      );
    }

    setForm({
      ...form,
      image_urls: [
        ...form.image_urls,
        ...uploadedUrls,
      ],
    });

    setUploading(false);
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    const {
  data: { user },
} = await supabase.auth.getUser();

    const {
  data,
  error,
} = await supabase
  .from("items")
  .insert([
    {
      item_name: form.name,

      vendor: form.vendor,

      main_category:
        form.main_category,

      sub_category:
        form.sub_category,

      price: Number(
        form.price
      ),

      description:
        form.description,

      tokopedia_url:
        form.tokopedia_url,

      shopee_url:
        form.shopee_url,

      whatsapp_url:
        form.whatsapp_url,

      official_url:
        form.official_url,

      image_url:
        form.image_urls[0] ||
        null,

      image_urls:
        form.image_urls,
    },
  ])
  .select()
  .single();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }
   if (
  user?.email &&
  data
) {
  await createAuditLog({
  userEmail: user.email,
  action: "CREATE_ITEM",

  itemId: data.id,

  itemName: data.item_name,
  newData: data,
});
}

    alert("Item added!");

    setForm({
      name: "",
      vendor: "",

      main_category: "",
      sub_category: "",

      price: "",
      description: "",

      tokopedia_url: "",
      shopee_url: "",
      whatsapp_url: "",
      official_url: "",

      image_urls: [],
    });
  }

  if (authLoading) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      Checking permissions...
    </main>
  );
}

  return (
    <main className="relative min-h-screen text-white">

      <div
  className="
    max-w-5xl
    mx-auto

    rounded-[32px]

    border
    border-cyan-300/20

    bg-[#051a2e]/80

    backdrop-blur-xl

    p-10

    shadow-[0_0_40px_rgba(0,255,255,0.08)]
  "
>

     <div className="flex items-start justify-between mb-8">

  <div>
    <h1 className="text-5xl font-bold text-white">
      Add New Item
    </h1>

    <p className="text-cyan-300 mt-2">
      Create New Catalog Item
    </p>
  </div>

  <button
    type="button"
    onClick={() => window.history.back()}
    className="
      flex
      items-center
      gap-2

      px-5
      py-3

      rounded-2xl

      border
      border-cyan-300/20

      bg-white/5

      text-cyan-300

      hover:bg-cyan-500/10

      transition
    "
  >
    <ArrowLeft size={18} />
    Back
  </button>

</div>

                <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* ITEM NAME */}
          <input
            name="name"
            placeholder="Item Name"
            value={form.name}
            onChange={handleChange}
            className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
          />

          {/* VENDOR */}
          <input
            name="vendor"
            placeholder="Vendor"
            value={form.vendor}
            onChange={handleChange}
            className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
          />

          {/* MAIN CATEGORY */}
          <select
            name="main_category"
            value={form.main_category}
            onChange={(e) =>
              setForm({
                ...form,
                main_category:
                  e.target.value,
                sub_category: "",
              })
            }
            className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
          >

            <option value="">
              Select Main Category
            </option>

            <option value="Main Material">
              Main Material
            </option>

            <option value="Asset">
              Asset
            </option>

          </select>

          {/* SUB CATEGORY */}
          <select
            name="sub_category"
            value={form.sub_category}
            onChange={handleChange}
            className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
          >

            <option value="">
              Select Sub Category
            </option>

            {form.main_category ===
              "Main Material" && (
              <>
                <option value="Membrane">
                  Membrane
                </option>

                <option value="Fixture">
                  Fixture
                </option>

                <option value="Bone Graft">
                  Bone Graft
                </option>
              </>
            )}

            {form.main_category ===
              "Asset" && (
              <>
                <option value="Autoclave">
                  Autoclave
                </option>

                <option value="Airmotor">
                  Airmotor
                </option>
              </>
            )}

          </select>

          {/* PRICE */}
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
          />

          {/* TOKOPEDIA */}
          <input
            name="tokopedia_url"
            placeholder="Tokopedia URL"
            value={form.tokopedia_url}
            onChange={handleChange}
            className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
          />

          {/* SHOPEE */}
          <input
            name="shopee_url"
            placeholder="Shopee URL"
            value={form.shopee_url}
            onChange={handleChange}
            className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
          />

          {/* WHATSAPP */}
          <input
            name="whatsapp_url"
            placeholder="WhatsApp URL"
            value={form.whatsapp_url}
            onChange={handleChange}
            className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
          />

          {/* OFFICIAL */}
          <input
            name="official_url"
            placeholder="Official URL"
            value={form.official_url}
            onChange={handleChange}
            className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
          />

          {/* UPLOAD */}
          <div
  className="
    rounded-2xl

    border
    border-dashed
    border-cyan-300/30

    bg-white/5

    p-6
  "
>

            <label
              className="
                block mb-2
                font-medium
                text-white
              "
            >
              Upload Images

            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={
                handleImageUpload
              }
              className="
  w-full

  border border-cyan-300/20

  p-4

  rounded-2xl

  bg-white/5

  text-white

  placeholder:text-white/40

  outline-none

  focus:border-cyan-400

  transition
"
            />

          </div>

          {/* PREVIEW */}
          {form.image_urls
            .length > 0 && (

            <div
              className="
                flex flex-wrap
                gap-4 mt-4
              "
            >

              {form.image_urls.map(
                (
                  url,
                  index
                ) => (

                  <Image
                    key={index}
                    src={url}
                    alt="Preview Image"
                    width={160}
                    height={160}
                    className="
  w-32 h-32

  rounded-2xl

  border
  border-cyan-300/20

  object-cover
"
                  />
                )
              )}

            </div>

          )}

          {/* BUTTON */}
          <button
            disabled={
              loading ||
              uploading
            }
            className="
  w-full

  py-4

  rounded-2xl

  border
  border-cyan-400/30

  bg-cyan-500/10

  text-cyan-300

  font-semibold

  hover:bg-cyan-500/20

  transition

  hover:shadow-[0_0_30px_rgba(0,255,255,0.25)]
"
          >

            {uploading
              ? "Uploading..."
              : loading
              ? "Saving..."
              : "Add Item"}

          </button>

        </form>

      </div>

    </main>
  );
}