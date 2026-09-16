import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

// hooks
import useCategories from "@/hooks/axios/common/use-categories";

// provider
import { useCategoryContext } from "@/provider/selected-category-provider";

interface SubCategoryImageProps {
  src?: string | null;
  alt: string;
}

function SubCategoryImage({ src, alt }: SubCategoryImageProps) {
  const [image_error, setImageError] = useState(false);

  if (!src || image_error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50">
        <span className="text-[10px] text-gray-400">No image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="120px"
      className="object-contain object-center p-1 transition-transform duration-200 group-hover:scale-105"
      onError={() => setImageError(true)}
    />
  );
}

export default function SubCategorySection() {
  const { data } = useCategories(true, "sub");
  const router = useRouter();

  const { selected_category, selected_sub_category, setSelectedSubCategory } =
    useCategoryContext();

  if (!data || !selected_category) return null;

  const category = data.find(
    (category) => category.id === selected_category.id,
  );

  if (!category?.sub_categories?.length) return null;

  const has_multiple_rows = category.sub_categories.length > 3;

  return (
    <section className="w-full min-w-0 overflow-hidden bg-white px-4 py-3 md:px-6">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 md:text-xl">
          Explore {category.name}
        </h2>
      </div>

      {/* Subcategories */}
      <div
        className={`no-scrollbar grid w-full min-w-0 grid-flow-col gap-2 overflow-x-auto overflow-y-hidden ${
          has_multiple_rows
            ? "h-[176px] auto-cols-[120px] grid-rows-2"
            : "h-[88px] auto-cols-[120px] grid-rows-1"
        }`}
      >
        {category.sub_categories.map((sub_category) => {
          const is_selected = selected_sub_category?.id === sub_category.id;

          return (
            <button
              key={sub_category.id}
              type="button"
              onClick={() => {
                setSelectedSubCategory(sub_category);
                router.push(`${category.slug}/${sub_category.slug}`);
              }}
              className={`group flex h-[84px] w-[120px] shrink-0 flex-col overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
                is_selected
                  ? "border-orange-500 bg-orange-50/40 shadow-sm"
                  : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
              }`}
            >
              {/* Image */}
              <div
                className={`relative h-[58px] w-full shrink-0 overflow-hidden ${
                  is_selected ? "bg-orange-50" : "bg-gray-50"
                }`}
              >
                <SubCategoryImage
                  src={sub_category.media}
                  alt={sub_category.name}
                />
              </div>

              {/* Name */}
              <div className="flex min-h-0 flex-1 items-center justify-center px-1.5">
                <span
                  className={`line-clamp-2 text-center text-[11px] leading-[14px] font-medium ${
                    is_selected ? "text-orange-600" : "text-gray-700"
                  }`}
                >
                  {sub_category.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
