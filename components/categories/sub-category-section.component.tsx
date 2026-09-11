// hooks
import useCategories from "@/hooks/axios/common/use-categories";
// provider
import { useCategoryContext } from "@/provider/selected-category-provider";
import Image from "next/image";
import { useRouter } from "next/router";

export default function SubCategorySection() {
  const { data } = useCategories(true, "sub");
  //   const {} = useCarousel();
  const router = useRouter();
  const { selected_category, selected_sub_category, setSelectedSubCategory } =
    useCategoryContext();

  if (!data || !selected_category) return null;

  const category = data.find(
    (category) => category.id === selected_category.id,
  );

  if (!category?.sub_categories?.length) return null;
  //   category.sub_categories = [
  //     ...category.sub_categories,
  //     {
  //       id: 576,
  //       name: "fadfasd",
  //     },
  //     {
  //       id: 567,
  //       name: "fad",
  //     },
  //     {
  //       id: 734,
  //       name: "fadfafasd",
  //     },
  //     {
  //       id: 234,
  //       name: "fadfewewasd",
  //     },
  //     {
  //       id: 987,
  //       name: "fadfavvvsd",
  //     },
  //     {
  //       id: 345,
  //       name: "fadfasd",
  //     },
  //   ];
  return (
    <section className="w-full min-w-0 overflow-hidden bg-white px-4 py-4 md:px-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 md:text-2xl">
            Shop by Subcategories
          </h2>

          <p className="mt-0.5 text-xs text-gray-500 md:text-sm">
            Explore {category.name}
          </p>
        </div>
      </div>

      {/* Subcategories */}
      <div className="no-scrollbar grid h-[220px] w-full max-w-full grid-flow-col grid-rows-2 gap-3 overflow-x-auto overflow-y-hidden pr-4 pb-1">
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
              className={`group flex w-[140px] shrink-0 flex-col overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 ${
                is_selected
                  ? "border-orange-500 bg-orange-50/40 shadow-sm"
                  : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
              }`}
            >
              {/* Image */}
              <div
                className={`relative h-[85px] w-full overflow-hidden ${
                  is_selected ? "bg-orange-50" : "bg-gray-50"
                }`}
              >
                {sub_category ? (
                  <Image
                    src={
                      "https://imgs.search.brave.com/jxIsST-j7vBayFEdFxDVxh5CT5t3C2Za-rRf7UwkFXg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2VsZWN0ZWRob21t/ZS5pbi9jZG4vc2hv/cC9maWxlcy85MDI0/NTA3MDJfZzFfMjRi/YmZhYzMtMWVjNC00/ODcyLWEwMjAtM2M2/MzI3OTdiNjBkLndl/YnA_dj0xNzgzOTI2/ODI4JndpZHRoPTEz/NTA"
                    }
                    alt={sub_category.name}
                    fill
                    sizes="140px"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="flex min-h-[45px] items-center justify-center px-2 py-1.5">
                <span
                  className={`line-clamp-2 text-center text-xs leading-4 font-medium ${
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
