"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddItemPage() {
  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    vendor: "",
    category: "",
    price: "",
    description: "",
    image_urls: [] as string[],
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
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

            category:
              form.category,

            price: Number(
              form.price
            ),

            description:
              form.description,

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
      category: "",
      price: "",
      description: "",
      image_urls: [],
    });
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

          <input
            name="category"
            placeholder="Category"
            value={form.category}
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