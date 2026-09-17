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
      <div className="flex h-full w-full items-center justify-center rounded-full border border-gray-300 bg-gray-50">
        <span className="text-[10px] text-gray-400">N/A</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="75px"
      className="object-cover object-center"
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
    <section className="w-full min-w-0 overflow-hidden bg-white px-4 py-4 md:px-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 md:text-xl">
          Explore {category.name}
        </h2>
      </div>

      {/* Subcategories */}
      <div
        className={`no-scrollbar grid w-full min-w-0 grid-flow-col gap-1 overflow-x-auto overflow-y-hidden ${
          has_multiple_rows
            ? "h-[190px] auto-cols-[105px] grid-rows-2 md:h-[238px] md:auto-cols-[150px]"
            : "h-[100px] auto-cols-[105px] grid-rows-1 md:h-[116px] md:auto-cols-[150px]"
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
              className="group flex h-[92px] w-[105px] shrink-0 flex-col items-center gap-1 md:h-[112px] md:w-[150px]"
            >
              {/* Circular Image */}
              <div
                className={`relative size-14 shrink-0 overflow-hidden rounded-full md:size-18.5 ${
                  is_selected ? "ring-2 ring-orange-500 ring-offset-2" : ""
                }`}
              >
                <SubCategoryImage
                  src={sub_category.media}
                  alt={sub_category.name}
                />
              </div>

              {/* Name */}
              <span
                className={`line-clamp-2 px-1 text-center text-[10px] leading-[13px] md:px-2 md:text-[11px] md:leading-[14px] ${
                  is_selected
                    ? "font-semibold text-orange-600"
                    : "font-medium text-gray-700"
                }`}
              >
                {sub_category.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
