import { useRouter } from "next/router";
import { useRef, useEffect, useState, useContext, useMemo } from "react";
// types
import type { FC } from "react";
import type {
  IFilterAttribute,
  IOption,
} from "@/hooks/axios/categories/use-category-specific-filter.hook";
import type { IResponseType } from "@/hooks/axios/categories/use-get-category-product.hook";

// local components
import ProductCard from "@/components/categories/product-card/product-card.component";
import ProductCardSkeleton from "@/components/categories/product-card/product-card-skeleton.component";
import SortFilterHeader from "@/components/categories/sort-filter-header/sort-filter-header.component";
import SortFilterHeaderSkeleton from "@/components/categories/sort-filter-header/sort-filter-header-skeleton.component";
import SideFilter from "@/components/categories/side-filters/side-filters.component";
import SortFilterDrawer from "@/components/categories/sort-filter-header/sort-filter-drawer.component";
import SideFiltersSkeleton from "./side-filters/side-filters-skeleton.component";
import ProductNotFound from "./product-not-found.component";
import FilterSortBar from "@/components/categories/filter-sort-bar.component";

// hooks
import useGetProductsByCategory from "@/hooks/axios/categories/use-get-category-product.hook";
import useCategorySortingFilters from "@/hooks/axios/categories/use-category-sorting-filters.hook";
import useCategorySpecificFilters from "@/hooks/axios/categories/use-category-specific-filter.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";
import clsx from "clsx";
import { isNewProduct } from "@/helpers/product.helper";

// context
import { FiltersSortBarState, FooterStateContext } from "@/context";

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
  category_slug?: string;
  category_type?: "main" | "sub" | "sub_sub";
};
const CategoryProducts: FC<IProps> = ({ category_slug, category_type }) => {
  const router = useRouter();
  const { state, updateState } = useContext(FiltersSortBarState);
  const { updateShow: updateShowFooter } = useContext(FooterStateContext);
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
  const brands = useMemo(() => {
    return selected_category_specific_filters
      .find(({ attribute }) => attribute.code === "brand")
      ?.options.filter((o) => o.is_enabled)
      .map((o) => o.value);
  }, [selected_category_specific_filters]);

  const filters = useMemo(() => {
    return selected_category_specific_filters
      .filter(({ attribute }) => attribute.code !== "brand")
      .reduce(
        (acc, filter) => {
          if (filter.options.some((o) => o.is_enabled)) {
            acc[filter.attribute.code] = filter.options
              .filter((o) => o.is_enabled)
              .map((o) => o.value);
          }
          return acc;
        },
        {} as Record<string, string[]>,
      );
  }, [selected_category_specific_filters]);

  const search = router.query.query as string;
  const {
    data,
    isPending: isProductPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetProductsByCategory({
    slug: category_slug,
    category_type,
    ...selected_sorting_filters,
    brands: brands,
    filters: filters,
    search: search,
  });

  const category_products = data?.pages.reduce<IResponseType["products"]>(
    (acc, { products }) => {
      return [...acc, ...products];
    },
    [],
  );

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
        sub_sub_category_id,
        bought_last_month,
      } = product;
      const updated_title =
        !brand ||
        brand.toLocaleLowerCase() == "generic" ||
        title.includes(brand)
          ? title
          : `${brand} ${title}`;

      const product_slug = generateSlug(product.title);
      const sortedVariants = (variants || []).sort(
        (a, b) =>
          (a.variant_pricing?.selling_price_with_commission ?? a.variant_pricing?.selling_price ?? (a as any).selling_price ?? 0) -
          (b.variant_pricing?.selling_price_with_commission ?? b.variant_pricing?.selling_price ?? (b as any).selling_price ?? 0),
      );

      const first_variant = sortedVariants[0];

      if (!first_variant) return null;
      const { id: variant_id, variant_medias, variant_pricing } = first_variant;

      const selling_price = Number(
        variant_pricing?.selling_price_with_commission ??
        variant_pricing?.selling_price ??
        (first_variant as any)?.selling_price_with_commission ??
        (first_variant as any)?.selling_price ??
        (product as any)?.selling_price ??
        (product as any)?.price ??
        0,
      );

      const mrp = Number(
        variant_pricing?.mrp ??
        (first_variant as any)?.mrp ??
        (product as any)?.mrp ??
        (product as any)?.original_price ??
        (product as any)?.price ??
        selling_price,
      );

      const discount_percentage =
        mrp > selling_price && mrp > 0
          ? Math.round(((mrp - selling_price) / mrp) * 100)
          : Math.round(Number((product as any)?.discount_percentage ?? 0));

      const product_reviews_link = `/${product_slug}/p/${product_id}/reviews`;
      const is_new = isNewProduct(created_at);
      return {
        product_id,
        variant_id,
        title: updated_title,
        src: `/${product_slug}/p/${product.id}/${variant_id}`,
        product_thumbnail: variant_medias[0]?.media ?? product_medias[0]?.media,
        selling_price,
        mrp,
        discount_percentage,
        is_new,
        have_variants: variants.length > 1,
        total_reviews: reviews_count,
        product_reviews_link,
        avg_rating,
        bought_last_month,
        is_wishlisted: !!first_variant._count.wishlists,
        sub_sub_category_id,
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
        rootMargin: "400px",
        threshold: 0,
      },
    );

    observer_ref.current.observe(load_more_ref.current);

    return () => observer_ref.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    updateShowFooter?.(!hasNextPage && !isProductPending);
  }, [hasNextPage, isProductPending]);

  if (!category_products?.length && !isProductPending && !isFetchingNextPage) {
    return <ProductNotFound query={search} />;
  }
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

        {category_slug && category_type && (
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
        )}
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
        {category_type && category_slug && (
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
        )}

        <div className="min-w-0 flex-1 space-y-4">
          <FilterSortBar className="sticky top-(--header-height) z-20 -mx-4 border-y border-gray-200" />
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {isProductPending ? (
              Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={`initial-skeleton-${i}`} />
              ))
            ) : formatted_category_products?.length === 0 ? (
              <ProductNotFound query={search} />
            ) : (
              formatted_category_products?.map((product, index) =>
                product ? (
                  <ProductCard
                    {...product}
                    index={index}
                    key={`category-product-${product.variant_id}`}
                  />
                ) : null,
              )
            )}

            {!isProductPending &&
              isFetchingNextPage &&
              Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={`next-page-skeleton-${i}`} />
              ))}
          </div>

          {/* observer */}
          {hasNextPage && <div ref={load_more_ref} className="h-1" />}
        </div>
      </div>
    </>
  );
};

export default CategoryProducts;
