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
    <main className="relative min-h-screen text-white">

  <img
    src="/hero-v2.jpg"
    alt="background"
    className="
      absolute inset-0
      w-full h-full
      object-cover
    "
  />

  <div className="relative z-10 p-10">

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
      Edit Item
    </h1>

    <p className="text-cyan-300 mt-2">
      Update Catalog Item
    </p>

  </div>

  <button
    type="button"
    onClick={() =>
      window.history.back()
    }
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
            onChange={(e) =>
              setForm({
                ...form,
                sub_category:
                  e.target.value,
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

          {/* ITEM CODE */}
          <input
            name="item_code"
            placeholder="Item Code"
            value={form.item_code}
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

          {/* UOM */}
          <input
            name="UOM"
            placeholder="UOM"
            value={form.UOM}
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

          {/* MANUFACTURE */}
          <input
            name="Manufacture"
            placeholder="Manufacture"
            value={
              form.Manufacture
            }
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

          {/* TYPE */}
          <input
            name="type"
            placeholder="Type"
            value={form.type}
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

          {/* TERM */}
          <input
            name="Term"
            placeholder="Term"
            value={form.Term}
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

          {/* REMARKS */}
          <input
            name="Remarks"
            placeholder="Remarks"
            value={form.Remarks}
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

          {/* MARKETPLACE URLS */}
          <div className="pt-4">

            <h2 className="text-xl font-bold text-cyan-300 mb-4">
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

              <input
                name="shopee_url"
                placeholder="Shopee URL"
                value={
                  form.shopee_url
                }
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

              <input
                name="whatsapp_url"
                placeholder="WhatsApp URL"
                value={
                  form.whatsapp_url
                }
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

              <input
                name="official_url"
                placeholder="Official Website URL"
                value={
                  form.official_url
                }
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

            </div>

          </div>

          {/* UPLOAD MULTIPLE IMAGES */}
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

  <label className="block mb-2 font-medium text-cyan-300">
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

          {/* SUBMIT */}
          <button
            disabled={saving}
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

hover:shadow-[0_0_30px_rgba(0,255,255,0.25)]

transition
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

      </div>

    </main>
  );
}