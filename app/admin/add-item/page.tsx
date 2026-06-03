"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRequireAuth } from "@/hooks/useRequireAuth";

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

    const { error } =
      await supabase
        .from("items")
        .insert([
          {
            item_name:
              form.name,

            vendor:
              form.vendor,

            // NEW
            main_category:
              form.main_category,

            sub_category:
              form.sub_category,

            price: Number(
              form.price
            ),

            description:
              form.description,

            // MARKETPLACE URLS
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
        ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
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
    <main className="min-h-screen bg-[#f5f5f5] p-10">

      <div
        className="
          max-w-2xl mx-auto
          bg-white
          p-8 rounded-3xl
          shadow-xl
          border border-gray-200
        "
      >

        <h1
          className="
            text-4xl font-bold
            mb-8 text-black
          "
        >
          Add New Item
        </h1>

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
              border border-gray-300
              p-4 rounded-xl
              bg-white
              text-black
              placeholder:text-gray-400
              outline-none
              focus:border-black
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
              border border-gray-300
              p-4 rounded-xl
              bg-white
              text-black
              placeholder:text-gray-400
              outline-none
              focus:border-black
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
              border border-gray-300
              p-4 rounded-xl
              bg-white
              text-black
              outline-none
              focus:border-black
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
              border border-gray-300
              p-4 rounded-xl
              bg-white
              text-black
              outline-none
              focus:border-black
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
              border border-gray-300
              p-4 rounded-xl
              bg-white
              text-black
              placeholder:text-gray-400
              outline-none
              focus:border-black
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
              border border-gray-300
              p-4 rounded-xl
              h-40
              bg-white
              text-black
              placeholder:text-gray-400
              outline-none
              focus:border-black
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
              border border-gray-300
              p-4 rounded-xl
              bg-white
              text-black
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
              border border-gray-300
              p-4 rounded-xl
              bg-white
              text-black
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
              border border-gray-300
              p-4 rounded-xl
              bg-white
              text-black
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
              border border-gray-300
              p-4 rounded-xl
              bg-white
              text-black
            "
          />

          {/* UPLOAD */}
          <div>

            <label
              className="
                block mb-2
                font-medium
                text-black
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
                w-full border p-4
                rounded-xl
                bg-white
                text-black
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
                      w-40 h-40
                      object-cover
                      rounded-2xl
                      border
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
              bg-black text-white
              px-6 py-4 rounded-xl
              w-full
              hover:opacity-90
              transition
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