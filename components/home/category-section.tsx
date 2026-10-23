import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import { ArrowRight, LayoutGrid } from "lucide-react";

import useCategories from "@/hooks/axios/common/use-categories";
import { useCategoryContext } from "@/provider/selected-category-provider";

const CategorySection: FC = () => {
  const { data: categories = [] } = useCategories(true);
  const { setSelectedCategory } = useCategoryContext();

  return (
    <section className="bg-white">
      <div className="px-3 sm:px-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          {/* <Link
            href="/"
            onClick={() => setSelectedCategory(null)}
            className="group text-brand flex items-center gap-1 text-sm font-semibold"
          >
            See all
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link> */}
        </div>

        {/* Compact category grid */}
        <div className="grid grid-cols-4 gap-x-3 sm:grid-cols-5 sm:gap-x-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
          {categories.map((category) => {
            const { id, name, slug } = category;

            return (
              <Link
                key={id}
                href={`/categories/${slug}`}
                onClick={() => setSelectedCategory(category)}
                className="group flex min-w-0 flex-col items-center"
              >
                {/* Category image */}
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-[#f7f6f4] transition-colors duration-200 group-hover:bg-[#f1eee9]">
                  {category.media?.icon ? (
                    <Image
                      src={category.media.icon}
                      alt={name}
                      width={100}
                      height={100}
                      sizes="(max-width: 640px) 22vw, (max-width: 1024px) 15vw, 110px"
                      className="h-[82%] w-[82%] object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <LayoutGrid
                      className="size-7 text-gray-400"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Category name */}
                <span className="group-hover:text-brand mt-2 line-clamp-2 w-full text-center text-xs leading-4 font-medium text-gray-800 transition-colors sm:text-[13px]">
                  {name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
