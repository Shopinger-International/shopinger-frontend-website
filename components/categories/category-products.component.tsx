import { useRef, useEffect, useState, useContext } from "react";
// types
import type { FC } from "react";
import type IProduct from "@/types/product";

// local components
import ProductCard from "@/components/categories/product-card.component";
import ProductCardSkeleton from "@/components/categories/product-card-skeleton.component";
import SortFilterHeader from "@/components/categories/sort-filter-header.component";
import SideFilter from "./side-filters.component";
import FilterDrawer from "./filter-drawer.component";

// hooks
import useGetProductsByCategory from "@/hooks/axios/categories/use-get-category-product.hook";
import useCategoryFilters from "@/hooks/axios/categories/use-category-filters.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";

// context
import { FiltersSortBarState } from "@/context";

const isNewProduct = (created_at: string | Date) => {
  const created = new Date(created_at);
  const now = new Date();

  const diffInDays =
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

  return diffInDays <= 7;
};

export type ISort =
  | "latest"
  | "price_low_high"
  | "price_high_low"
  | "top_rated";

export type ISelectedFilters = {
  sort?: ISort;
  min_rating?: number;
  min_price?: number;
  max_price?: number;
};

type IProps = {
  category_slug: string;
  category_type: "main" | "sub";
};
const CategoryProducts: FC<IProps> = ({ category_slug, category_type }) => {
  const { state, updateState } = useContext(FiltersSortBarState);
  const [selected_filters, setSelectedFilters] =
    useState<ISelectedFilters | null>(null);
  const { data: category_filters } = useCategoryFilters({
    category_slug,
    category_type,
  });
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetProductsByCategory({
      slug: category_slug,
      category_type,
      ...selected_filters,
    });

  const category_products = data?.pages.reduce<IProduct[]>(
    (acc, { products }) => {
      return [...acc, ...products];
    },
    [],
  );

  const formatted_category_products = category_products?.map((product) => {
    const {
      id: product_id,
      variants,
      title,
      brand,
      created_at,
      product_medias,
      reviews_count,
    } = product;
    const updated_title =
      !brand || brand.toLocaleLowerCase() == "generic" || title.includes(brand)
        ? title
        : `${brand} ${title}`;

    const product_slug = generateSlug(product.title);
    const {
      id: variant_id,
      variant_medias,
      variant_inventory,
      variant_pricing,
    } = variants[0];
    const { mrp, selling_price_with_commission } = variant_pricing;

    const discount_percentage = Math.round(
      ((mrp - selling_price_with_commission) / mrp) * 100,
    );
    const product_reviews_link = `/${product_slug}/p/${product_id}/reviews`;
    const is_new = isNewProduct(created_at);
    return {
      product_id,
      variant_id,
      title: updated_title,
      src: `/${product_slug}/p/${product.id}/${variant_id}`,
      product_thumbnail: variant_medias[0]?.media ?? product_medias[0].media,
      selling_price: selling_price_with_commission,
      mrp,
      discount_percentage,
      is_new,
      have_variants: variants.length > 1,
      total_reviews: reviews_count,
      product_reviews_link,
    };
  });

  const load_more_ref = useRef<HTMLDivElement | null>(null);
  const observer_ref = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!load_more_ref.current) return;

    if (observer_ref.current) observer_ref.current.disconnect();

    observer_ref.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer_ref.current.observe(load_more_ref.current);

    return () => observer_ref.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <>
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${state === "filter" ? "visible opacity-100" : "invisible opacity-0"} `}
          onClick={() => updateState?.(null)}
        />

        {/* Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform bg-white transition-transform duration-300 ease-in-out ${state === "filter" ? "translate-x-0" : "-translate-x-full"} `}
        >
          <div className="h-screen overflow-y-auto">
            <SideFilter
              category_slug={category_slug}
              category_type={category_type}
            />
          </div>
        </div>
      </>

      <FilterDrawer>
        {category_filters && (
          <SortFilterHeader
            selected_filters={selected_filters}
            {...category_filters}
            onChange={(selected_filter) => setSelectedFilters(selected_filter)}
          />
        )}
      </FilterDrawer>
      <div className="flex space-x-3 px-4">
        <div className="sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] min-w-70 self-start overflow-y-auto lg:block">
          <SideFilter
            category_slug={category_slug}
            category_type={category_type}
          />
        </div>
        <div className="flex-1 space-y-4">
          {category_filters && (
            <div className="hidden lg:block">
              <SortFilterHeader
                selected_filters={selected_filters}
                {...category_filters}
                onChange={(selected_filter) =>
                  setSelectedFilters(selected_filter)
                }
              />
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {formatted_category_products?.map((product) => (
              <ProductCard
                {...product}
                key={`category-product-${product.product_id}`}
              />
            ))}

            {/* observer */}
            {!isFetchingNextPage && !isPending && (
              <div ref={load_more_ref} className="h-10" />
            )}
          </div>
          {(isPending || hasNextPage) && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryProducts;
