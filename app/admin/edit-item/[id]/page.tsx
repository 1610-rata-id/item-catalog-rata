"use client";

import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/lib/supabase";

import {
  useParams,
  useRouter,
} from "next/navigation";

export default function EditItemPage() {

  const {
  loading: authLoading,
  role,
} = useRequireAuth([
  "admin",
  "procurement",
]);

  const router = useRouter();

  const params = useParams();

  const id = params.id;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [form, setForm] = useState({
    item_name: "",
    vendor: "",

    // CATEGORY
    main_category: "",
    sub_category: "",

    // MARKETPLACE URLS
    tokopedia_url: "",
    shopee_url: "",
    whatsapp_url: "",
    official_url: "",

    price: "",
    description: "",
    image_urls: [] as string[],
    item_code: "",
    UOM: "",
    Manufacture: "",
    type: "",
    Term: "",
    Remarks: "",
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

  async function uploadImage(
    file: File
  ) {
    setUploading(true);

    const fileExt =
      file.name.split(".").pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const filePath = `catalog/${fileName}`;

    const { error } =
      await supabase.storage
        .from("item-images")
        .upload(filePath, file);

    if (error) {
      setUploading(false);

      alert(error.message);

      return null;
    }

    const { data } = supabase.storage
      .from("item-images")
      .getPublicUrl(filePath);

    setUploading(false);

    return data.publicUrl;
  }

  async function getItem() {
    const { data, error } =
      await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
      alert(error.message);

      router.push(
        "/admin/dashboard"
      );

      return;
    }

    setForm({
      item_name:
        data.item_name || "",

      vendor:
        data.vendor || "",

      // CATEGORY
      main_category:
        data.main_category || "",

      sub_category:
        data.sub_category || "",

      // MARKETPLACE URLS
      tokopedia_url:
        data.tokopedia_url || "",

      shopee_url:
        data.shopee_url || "",

      whatsapp_url:
        data.whatsapp_url || "",

      official_url:
        data.official_url || "",

      price:
        data.price || "",

      description:
        data.description || "",

      image_urls:
        data.image_urls || [],

      item_code:
        data.item_code || "",

      UOM:
        data.UOM || "",

      Manufacture:
        data.Manufacture || "",

      type:
        data.type || "",

      Term:
        data.Term || "",

      Remarks:
        data.Remarks || "",
    });

    setLoading(false);
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);

    const { error } =
      await supabase
        .from("items")
        .update({
          item_name:
            form.item_name,

          vendor:
            form.vendor,

          // CATEGORY
          main_category:
            form.main_category,

          sub_category:
            form.sub_category,

          // MARKETPLACE URLS
          tokopedia_url:
            form.tokopedia_url,

          shopee_url:
            form.shopee_url,

          whatsapp_url:
            form.whatsapp_url,

          official_url:
            form.official_url,

          price: Number(
            form.price
          ),

          description:
            form.description,

          image_url:
            form.image_urls[0] || null,

          image_urls:
            form.image_urls,

          item_code:
            form.item_code,

          UOM:
            form.UOM,

          Manufacture:
            form.Manufacture,

          type:
            form.type,

          Term:
            form.Term,

          Remarks:
            form.Remarks,
        })
        .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Item updated!");

    router.push(
      "/admin/dashboard"
    );
  }

  useEffect(() => {
  if (!authLoading) {
    getItem();
  }
}, [authLoading]);

  if (authLoading) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      Checking authentication...
    </main>
  );
}

if (loading) {
  return (
    <main className="p-10">
      Loading...
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#f8f8f7] p-10">

      <div
        className="
          max-w-3xl mx-auto
          bg-white rounded-3xl
          shadow-xl p-10
        "
      >

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-bold text-black">
              Edit Item
            </h1>

            <p className="text-gray-700 mt-2">
              Update catalog item
            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/dashboard"
              )
            }
            className="
              border border-gray-300
              px-5 py-3
              rounded-xl
              bg-white
              text-black
              hover:bg-gray-100
              transition
            "
          >
            Back
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* ITEM NAME */}
          <input
            name="item_name"
            placeholder="Item Name"
            value={form.item_name}
            onChange={handleChange}
            className="
              w-full border p-4
              rounded-xl
              text-black
              placeholder:text-gray-500
            "
          />

          {/* VENDOR */}
          <input
            name="vendor"
            placeholder="Vendor"
            value={form.vendor}
            onChange={handleChange}
            className="
              w-full border p-4
              rounded-xl
              text-black
              placeholder:text-gray-500
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
            onChange={(e) =>
              setForm({
                ...form,
                sub_category:
                  e.target.value,
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

                <option value="Prosthetic">
                  Prosthetic
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

                <option value="Implant Motor">
                  Implant Motor
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
              w-full border p-4
              rounded-xl
              text-black
              placeholder:text-gray-500
            "
          />

          {/* ITEM CODE */}
          <input
            name="item_code"
            placeholder="Item Code"
            value={form.item_code}
            onChange={handleChange}
            className="
              w-full border p-4
              rounded-xl
              text-black
              placeholder:text-gray-500
            "
          />

          {/* UOM */}
          <input
            name="UOM"
            placeholder="UOM"
            value={form.UOM}
            onChange={handleChange}
            className="
              w-full border p-4
              rounded-xl
              text-black
              placeholder:text-gray-500
            "
          />

          {/* MANUFACTURE */}
          <input
            name="Manufacture"
            placeholder="Manufacture"
            value={
              form.Manufacture
            }
            onChange={handleChange}
            className="
              w-full border p-4
              rounded-xl
              text-black
              placeholder:text-gray-500
            "
          />

          {/* TYPE */}
          <input
            name="type"
            placeholder="Type"
            value={form.type}
            onChange={handleChange}
            className="
              w-full border p-4
              rounded-xl
              text-black
              placeholder:text-gray-500
            "
          />

          {/* TERM */}
          <input
            name="Term"
            placeholder="Term"
            value={form.Term}
            onChange={handleChange}
            className="
              w-full border p-4
              rounded-xl
              text-black
              placeholder:text-gray-500
            "
          />

          {/* REMARKS */}
          <input
            name="Remarks"
            placeholder="Remarks"
            value={form.Remarks}
            onChange={handleChange}
            className="
              w-full border p-4
              rounded-xl
              text-black
              placeholder:text-gray-500
            "
          />

          {/* MARKETPLACE URLS */}
          <div className="pt-4">

            <h2 className="text-xl font-bold text-black mb-4">
              Marketplace Links
            </h2>

            <div className="space-y-4">

              <input
                name="tokopedia_url"
                placeholder="Tokopedia URL"
                value={
                  form.tokopedia_url
                }
                onChange={handleChange}
                className="
                  w-full border p-4
                  rounded-xl
                  text-black
                  placeholder:text-gray-500
                "
              />

              <input
                name="shopee_url"
                placeholder="Shopee URL"
                value={
                  form.shopee_url
                }
                onChange={handleChange}
                className="
                  w-full border p-4
                  rounded-xl
                  text-black
                  placeholder:text-gray-500
                "
              />

              <input
                name="whatsapp_url"
                placeholder="WhatsApp URL"
                value={
                  form.whatsapp_url
                }
                onChange={handleChange}
                className="
                  w-full border p-4
                  rounded-xl
                  text-black
                  placeholder:text-gray-500
                "
              />

              <input
                name="official_url"
                placeholder="Official Website URL"
                value={
                  form.official_url
                }
                onChange={handleChange}
                className="
                  w-full border p-4
                  rounded-xl
                  text-black
                  placeholder:text-gray-500
                "
              />

            </div>

          </div>

          {/* UPLOAD MULTIPLE IMAGES */}
          <div>

            <label className="block mb-2 font-medium text-black">
              Upload Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files =
                  e.target.files;

                if (!files) return;

                const uploadedUrls: string[] =
                  [];

                for (
                  let i = 0;
                  i < files.length;
                  i++
                ) {
                  const url =
                    await uploadImage(
                      files[i]
                    );

                  if (url) {
                    uploadedUrls.push(
                      url
                    );
                  }
                }

                setForm({
                  ...form,
                  image_urls: [
                    ...form.image_urls,
                    ...uploadedUrls,
                  ],
                });
              }}
              className="
                w-full border p-4
                rounded-xl
                bg-white
                text-black
              "
            />

          </div>

          {/* PREVIEW IMAGES */}
          {form.image_urls.length >
            0 && (
            <div className="grid grid-cols-3 gap-4">

              {form.image_urls.map(
                (url, index) => (
                  <div
                    key={index}
                    className="relative"
                  >

                    <Image
                      src={url}
                      alt="Item Image"
                      width={300}
                      height={300}
                      className="
                        w-full h-32
                        object-cover
                        rounded-2xl
                        border
                      "
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const updated =
                          [
                            ...form.image_urls,
                          ];

                        updated.splice(
                          index,
                          1
                        );

                        setForm({
                          ...form,
                          image_urls:
                            updated,
                        });
                      }}
                      className="
                        absolute top-2 right-2
                        bg-red-500 text-white
                        w-7 h-7 rounded-full
                        text-sm
                      "
                    >
                      ✕
                    </button>

                  </div>
                )
              )}

            </div>
          )}

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            value={
              form.description
            }
            onChange={handleChange}
            className="
              w-full border p-4
              rounded-xl h-40
              text-black
              placeholder:text-gray-500
            "
          />

          {/* SUBMIT */}
          <button
            disabled={saving}
            className="
              w-full bg-black
              text-white
              rounded-xl p-4
              hover:opacity-90
            "
          >
            {uploading
              ? "Uploading..."
              : saving
              ? "Saving..."
              : "Update Item"}
          </button>

        </form>

      </div>

    </main>
  );
}