import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type IProduct from "@/types/product";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import ProductCard from "@/components/categories/product-card/product-card.component";

// hooks
import useGetProductsByCategory from "@/hooks/axios/categories/use-get-category-product.hook";
import useCategorySortingFilters from "@/hooks/axios/categories/use-category-sorting-filters.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  category_slug: string;
};

const MainCategoryPage: NextPageWithLayout<IProps> = ({}) => {
  const router = useRouter();
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetProductsByCategory({
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
      <section className="min-h-screen w-full">
        <div className="mx-auto mt-(--header-height) max-w-6xl space-y-3 pb-4">
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
        </div>
      </section>
    </>
  );
};

export default MainCategoryPage;

MainCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout show_filter_sort_bar={true}>{page}</MainLayout>;
};
