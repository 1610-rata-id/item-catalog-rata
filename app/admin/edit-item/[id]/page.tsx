"use client";

import Image from "next/image";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/lib/supabase";
import { createAuditLog } from "@/lib/audit";

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
    category: "",
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

  const [
  categories,
  setCategories,
] = useState<string[]>([]);

const [
  mainCategories,
  setMainCategories,
] = useState<string[]>([]);

const [
  subCategories,
  setSubCategories,
] = useState<string[]>([]);

const [showCategory, setShowCategory] =
  useState(false);

const [showMainCategory, setShowMainCategory] =
  useState(false);

const [showSubCategory, setShowSubCategory] =
  useState(false);

const categoryRef =
  useRef<HTMLDivElement>(null);

const mainCategoryRef =
  useRef<HTMLDivElement>(null);

const subCategoryRef =
  useRef<HTMLDivElement>(null);

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

    try {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(
          `Format gambar tidak didukung: ${file.name}. Gunakan JPEG, PNG, atau WebP.`
        );
        return null;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        alert("Sesi login tidak ditemukan. Silakan login kembali.");
        return null;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/api/admin/upload-item-image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.url) {
        alert(
          result.error ||
            `Gagal mengunggah gambar: ${file.name}`
        );
        return null;
      }

      return result.url as string;
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(`Terjadi kesalahan saat mengunggah gambar: ${file.name}`);
      return null;
    } finally {
      setUploading(false);
    }
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
      category:
        data.category || "",

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

  async function getCategories() {

  const { data, error } =
    await supabase

      .from("items")

      .select(`
  category,
  main_category,
  sub_category
`);

  if (error) {

    console.log(error);

    return;

  }

  const categorySet =
  new Set<string>();

  const mainSet =
    new Set<string>();

  const subSet =
  new Set<string>();

  data?.forEach(
  (item: {
    category?: string | null;
    main_category?: string | null;
    sub_category?: string | null;
  }) => {

  if (item.category) {

    categorySet.add(
      item.category
    );

  }

  if (item.main_category) {

    mainSet.add(
      item.main_category
    );

  }

  if (item.sub_category) {

  subSet.add(
    item.sub_category
  );

}

});

  setCategories(
  Array.from(categorySet).sort()
);

setMainCategories(
  Array.from(mainSet).sort()
);

setSubCategories(
  Array.from(subSet).sort()
);

}

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);

   const {
  data: { user },
} = await supabase.auth.getUser();

   const { data: oldItem } =
  await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

    const {
  data: updatedItem,
  error,
} =
  await supabase
    .from("items")
    .update({
          item_name:
            form.item_name,

          vendor:
            form.vendor,

          // CATEGORY
          category:
            form.category,

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
        .eq("id", id)
.select()
.single();

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }


    // Bersihkan gambar lama setelah update database berhasil.
    // Ringkasan hanya ditampilkan jika ada gambar yang dikeluarkan dari form.
    let cleanupSummary: {
      deletedImages: number;
      keptImages: number;
      failedImages: number;
    } | null = null;

    if (oldItem && updatedItem) {
      const oldUrls = [
        oldItem.image_url,
        ...(Array.isArray(oldItem.image_urls)
          ? oldItem.image_urls
          : []),
      ].filter(
        (url): url is string =>
          typeof url === "string" && url.trim().length > 0
      );

      const newUrls = new Set([
        updatedItem.image_url,
        ...(Array.isArray(updatedItem.image_urls)
          ? updatedItem.image_urls
          : []),
      ]);

      const removedUrls = [...new Set(oldUrls)].filter(
        (url) => !newUrls.has(url)
      );

      if (removedUrls.length > 0) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session?.access_token) {
            cleanupSummary = {
              deletedImages: 0,
              keptImages: 0,
              failedImages: removedUrls.length,
            };
          } else {
            const cleanupResponse = await fetch(
              "/api/admin/cleanup-item-images",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                  itemId: updatedItem.id,
                  imageUrls: removedUrls,
                }),
              }
            );

            const cleanupResult = await cleanupResponse.json();

            if (!cleanupResponse.ok) {
              console.error(
                "Image cleanup request failed:",
                cleanupResult
              );

              cleanupSummary = {
                deletedImages: Number(cleanupResult.deletedImages) || 0,
                keptImages: Number(cleanupResult.keptImages) || 0,
                failedImages:
                  Number(cleanupResult.failedImages) || removedUrls.length,
              };
            } else {
              cleanupSummary = {
                deletedImages: Number(cleanupResult.deletedImages) || 0,
                keptImages: Number(cleanupResult.keptImages) || 0,
                failedImages: Number(cleanupResult.failedImages) || 0,
              };
            }
          }
        } catch (cleanupError) {
          console.error("Image cleanup request failed:", cleanupError);
          cleanupSummary = {
            deletedImages: 0,
            keptImages: 0,
            failedImages: removedUrls.length,
          };
        }
      }
    }

    if (
  user?.email &&
  oldItem &&
  updatedItem
) {
  await createAuditLog({
    userEmail: user.email,

    action: "UPDATE_ITEM",

    itemId: updatedItem.id,

    itemName:
      updatedItem.item_name,

    oldData: oldItem,

    newData: updatedItem,
  });
}

    if (cleanupSummary) {
      alert(
        `Item updated!\n\nHasil cleanup gambar:\n${cleanupSummary.deletedImages} gambar dihapus, ${cleanupSummary.keptImages} gambar dipertahankan, ${cleanupSummary.failedImages} gagal.`
      );
    } else {
      alert("Item updated!");
    }

    router.push(
      "/admin/dashboard"
    );
  }

  useEffect(() => {
  if (authLoading) return;

  const loadData = async () => {
    await Promise.all([
      getItem(),
      getCategories(),
    ]);
  };

  void loadData();
}, [authLoading]);

useEffect(() => {

  function handleClick(
    e: MouseEvent
  ) {

    if (
      !categoryRef.current?.contains(
        e.target as Node
      )
    ) {

      setShowCategory(false);

    }

  }

  window.addEventListener(
    "click",
    handleClick
  );

  return () =>
    window.removeEventListener(
      "click",
      handleClick
    );

}, []);

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

          {/* CATEGORY */}

<div
  ref={categoryRef}
  className="relative"
>

  <button
    type="button"
    onClick={() =>
      setShowCategory(
        !showCategory
      )
    }
    className="
      w-full

      border border-cyan-300/20

      p-4

      rounded-2xl

      bg-[#0d2742]

      text-white

      flex
      justify-between
      items-center

      transition

      hover:border-cyan-400
    "
  >

    <span>

      {form.category ||

        "Select Category"}

    </span>

    <span>

      ▼

    </span>

  </button>

  {showCategory && (

    <div
      className="
        absolute

        top-full

        mt-2

        left-0

        w-full

        max-h-72

        overflow-y-auto

        rounded-2xl

        bg-[#0d2742]

        border border-cyan-300/20

        shadow-xl

        z-50
      "
    >

      {categories.map(
        (category) => (

          <button
            key={category}

            type="button"

            onClick={() => {

              setForm({

                ...form,

                category,

              });

              setShowCategory(
                false
              );

            }}

            className="
              w-full

              text-left

              px-4

              py-3

              text-white

              hover:bg-cyan-500/20

              transition
            "
          >

            {category}

          </button>

        )
      )}

    </div>

  )}

</div>

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

  bg-[#0d2742]

  text-white

  outline-none

  focus:border-cyan-400

  transition
"
>

  <option
  value=""
  className="bg-[#0d2742] text-white"
>
  Select Main Category
</option>

{mainCategories.map(
  (category) => (
    <option
      key={category}
      value={category}
      className="bg-[#0d2742] text-white"
    >
      {category}
    </option>
  )
)}

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

  bg-[#0d2742]

  text-white

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
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
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
  value={form.description}
  onChange={handleChange}
  rows={12}
  className="
    w-full

    min-h-[300px]
    resize-y

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