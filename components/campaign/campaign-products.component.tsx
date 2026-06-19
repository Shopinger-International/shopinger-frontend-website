import { useRef, useEffect, useContext } from "react";
// types
import type { FC } from "react";
import type IProduct from "@/types/product";

// hooks
import useCampaignProducts from "@/hooks/axios/campaign/use-campaign-product.hook";

// helpers
import { isNewProduct, generateSlug } from "@/helpers/product.helper";

// local components
import ProductCard from "@/components/categories/product-card/product-card.component";
import ProductCardSkeleton from "@/components/categories/product-card/product-card-skeleton.component";

// context
import { FooterStateContext } from "@/context";

type IProps = {
  campaign_id: number;
};
const CampaignProducts: FC<IProps> = ({ campaign_id }) => {
  const { updateShow: updateShowFooter } = useContext(FooterStateContext);
  const {
    data,
    isPending: isProductPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCampaignProducts({ campaign_id });

  const campaign_products = data?.pages.reduce<
    Array<
      IProduct & {
        avg_rating: number;
      }
    >
  >((acc, { products }) => {
    return [...acc, ...products];
  }, []);

  const formatted_campaign_products = campaign_products
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
      const { id: variant_id, variant_medias, variant_pricing } = first_variant;
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
  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isProductPending
          ? Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={`initial-skeleton-${i}`} />
            ))
          : formatted_campaign_products?.map((product) => (
              // @ts-ignore
              <ProductCard
                {...product}
                key={`category-product-${product?.variant_id}`}
              />
            ))}

        {/* infinite scroll loading */}
        {!isProductPending &&
          isFetchingNextPage &&
          Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={`next-page-skeleton-${i}`} />
          ))}
      </div>
      {/* observer */}
      {hasNextPage && <div ref={load_more_ref} className="h-1" />}
    </>
  );
};
export default CampaignProducts;
