import { useRouter } from "next/router";
import { useRef, useEffect, useState, useContext } from "react";
// types
import type { FC } from "react";
import type IProduct from "@/types/product";
import type {
  IFilterAttribute,
  IOption,
} from "@/hooks/axios/categories/use-category-specific-filter.hook";

// local components
import ProductCard from "@/components/categories/product-card/product-card.component";
import ProductCardSkeleton from "@/components/categories/product-card/product-card-skeleton.component";
import SortFilterHeader from "@/components/categories/sort-filter-header/sort-filter-header.component";
import SortFilterHeaderSkeleton from "@/components/categories/sort-filter-header/sort-filter-header-skeleton.component";
import SideFilter from "@/components/categories/side-filters/side-filters.component";
import SortFilterDrawer from "@/components/categories/sort-filter-header/sort-filter-drawer.component";
import SideFiltersSkeleton from "./side-filters/side-filters-skeleton.component";

// hooks
import useGetProductsByCategory from "@/hooks/axios/categories/use-get-category-product.hook";
import useCategorySortingFilters from "@/hooks/axios/categories/use-category-sorting-filters.hook";
import useCategorySpecificFilters from "@/hooks/axios/categories/use-category-specific-filter.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";
import clsx from "clsx";

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
  category_type: "main" | "sub" | "sub_sub";
};
const CategoryProducts: FC<IProps> = ({ category_slug, category_type }) => {
  const router = useRouter();
  const { state, updateState } = useContext(FiltersSortBarState);
  const [selected_sorting_filters, setSelectedSortingFilters] =
    useState<ISelectedFilters | null>(null);
  const {
    data: category_sorting_filters,
    isPending: is_category_sorting_filters_pending,
  } = useCategorySortingFilters({
    category_slug,
    category_type,
  });
  const [
    selected_category_specific_filters,
    setSelectedCategorySpecificFilters,
  ] = useState<
    Array<
      IFilterAttribute & {
        options: Array<IOption>;
      }
    >
  >([]);
  const {
    data: category_specific_filters = [],
    isPending: is_category_specific_filters_pending,
  } = useCategorySpecificFilters({
    category_slug,
    category_type,
  });
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetProductsByCategory({
      slug: category_slug,
      category_type,
      ...selected_sorting_filters,
      brands: selected_category_specific_filters
        .find(({ attribute }) => attribute.code == "brand")
        ?.options.filter((option) => option.is_enabled)
        .map((option) => option.value),
      filters: selected_category_specific_filters
        .filter(({ attribute }) => attribute.code !== "brand")
        .reduce((acc, filter) => {
          if (filter.options.some(({ is_enabled }) => is_enabled)) {
            return {
              [filter.attribute.code]: filter.options
                .filter(({ is_enabled }) => is_enabled)
                .map(({ value }) => value),
            };
          }
          return acc;
        }, {}),
      search: router.query.query as string,
    });

  const category_products = data?.pages.reduce<
    Array<
      IProduct & {
        avg_rating: number;
      }
    >
  >((acc, { products }) => {
    return [...acc, ...products];
  }, []);

  useEffect(() => {
    if (is_category_specific_filters_pending || !category_sorting_filters)
      return;
    setSelectedCategorySpecificFilters(category_specific_filters);
  }, [category_sorting_filters, is_category_specific_filters_pending]);

  const formatted_category_products = category_products
    ?.map((product) => {
      const {
        id: product_id,
        variants,
        title,
        brand,
        created_at,
        product_medias,
        reviews_count,
        avg_rating,
      } = product;
      const updated_title =
        !brand ||
        brand.toLocaleLowerCase() == "generic" ||
        title.includes(brand)
          ? title
          : `${brand} ${title}`;

      const product_slug = generateSlug(product.title);
      const sortedVariants = (variants || []).sort(
        ({ variant_pricing: a }, { variant_pricing: b }) =>
          a.selling_price_with_commission - b.selling_price_with_commission,
      );

      const first_variant = sortedVariants[0];

      if (!first_variant) return null;
      const {
        id: variant_id,
        variant_medias,
        variant_inventory,
        variant_pricing,
      } = first_variant;
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
        avg_rating,
      };
    })
    .filter(Boolean);

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
        <div
          className={clsx(
            "fixed inset-0 z-40 h-full bg-black/40 transition-opacity duration-300",
            state == "filter" ? "visible opacity-100" : "invisible opacity-0",
          )}
          onClick={() => updateState?.(null)}
        />

        <div
          className={clsx(
            "fixed inset-y-0 left-0 z-50 transform bg-white transition-transform duration-300 ease-in-out",
            state == "filter" ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="h-screen overflow-y-auto">
            <SideFilter
              category_slug={category_slug}
              category_type={category_type}
              filters={selected_category_specific_filters}
              handleFiltersChange={(updated_filters) => {
                setSelectedCategorySpecificFilters(updated_filters);
              }}
            />
          </div>
        </div>
      </>

      <SortFilterDrawer>
        {category_sorting_filters && (
          <SortFilterHeader
            selected_filters={selected_sorting_filters}
            {...category_sorting_filters}
            onChange={(selected_filter) =>
              setSelectedSortingFilters(selected_filter)
            }
          />
        )}
      </SortFilterDrawer>
      <div className="flex space-x-4 px-4">
        <div className="sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] min-w-70 self-start overflow-y-auto lg:block">
          {is_category_specific_filters_pending ? (
            <SideFiltersSkeleton />
          ) : (
            <SideFilter
              filters={selected_category_specific_filters}
              handleFiltersChange={(updated_filters) => {
                setSelectedCategorySpecificFilters(updated_filters);
              }}
              category_slug={category_slug}
              category_type={category_type}
            />
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div className="hidden lg:block">
            {is_category_sorting_filters_pending ? (
              <SortFilterHeaderSkeleton />
            ) : (
              category_sorting_filters && (
                <SortFilterHeader
                  selected_filters={selected_sorting_filters}
                  {...category_sorting_filters}
                  onChange={(selected_filter) =>
                    setSelectedSortingFilters(selected_filter)
                  }
                />
              )
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {formatted_category_products?.map((product) => (
              <ProductCard
                {...product}
                key={`category-product-${product?.product_id}`}
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
