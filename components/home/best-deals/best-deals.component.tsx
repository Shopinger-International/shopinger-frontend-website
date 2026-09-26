import { useMemo } from "react";
import type { FC } from "react";
import type { IResponse } from "@/hooks/axios/home/use-feed.hook";

// hooks
import useSectionProducts from "@/hooks/axios/home/use-section-products.hook";

// local components
import HomeProductRow from "@/components/home/home-product-row.component";
import HomeProductCard, {
  type IHomeProduct,
} from "@/components/home/home-product-card.component";

type IProps = {
  products: IResponse["data"]["deals_of_the_day"];
  fallback_products?: Array<any>;
};

const BestDeals: FC<IProps> = ({ products = [], fallback_products = [] }) => {
  const formatted_products = useMemo<IHomeProduct[]>(() => {
    // 1. From deals_of_the_day
    if (products && Array.isArray(products) && products.length > 0) {
      return products.map((p) => {
        const selling_price = Number((p as any).selling_price ?? (p as any).selling_price_with_commission ?? 0) || 0;
        const mrp = Number((p as any).mrp ?? 0) || 0;
        const calculated_discount =
          mrp > selling_price && mrp > 0
            ? Math.round(((mrp - selling_price) / mrp) * 100)
            : 0;
        const discount_val = (p as any).discount ?? (p as any).discount_percentage ?? calculated_discount;

        return {
          product_id: p.product_id,
          variant_id: p.variant_id,
          title: p.title,
          media_url: p.media_url,
          discount_percentage: Number(discount_val) || 0,
          discount: Number(discount_val) || 0,
          selling_price,
          mrp,
          avg_rating: (p as any).avg_rating ?? (p as any).average_rating ?? 0,
          rating_count: (p as any).reviews_count ?? (p as any).ratings_count ?? (p as any).total_reviews ?? ((p as any).bought_last_month ? `${(p as any).bought_last_month}+` : undefined),
          sub_sub_category_id: (p as any).sub_sub_category_id ?? 0,
        };
      });
    }

    // 2. From fallback_products (trending / featured)
    if (fallback_products && Array.isArray(fallback_products) && fallback_products.length > 0) {
      return fallback_products.map((p: any) => {
        const selling_price = Number(p.selling_price ?? p.selling_price_with_commission ?? p.variants?.[0]?.variant_pricing?.selling_price_with_commission ?? 0) || 0;
        const mrp = Number(p.mrp ?? p.variants?.[0]?.variant_pricing?.mrp ?? 0) || 0;
        const calculated_discount =
          mrp > selling_price && mrp > 0
            ? Math.round(((mrp - selling_price) / mrp) * 100)
            : 0;
        const discount_val = p.discount_percentage ?? p.discount ?? calculated_discount;

        return {
          product_id: p.product_id ?? p.id,
          variant_id: p.variant_id ?? p.variants?.[0]?.id ?? 0,
          title: p.title,
          media_url: p.media_url ?? p.variants?.[0]?.variant_medias?.[0]?.media?.url ?? p.product_medias?.[0]?.media?.url ?? "",
          discount_percentage: Number(discount_val) || 0,
          discount: Number(discount_val) || 0,
          selling_price,
          mrp,
          avg_rating: p.avg_rating ?? p.rating ?? p.average_rating ?? 0,
          rating_count: p.reviews_count ?? p.ratings_count ?? p.rating_count ?? p.total_reviews ?? (p.bought_last_month ? `${p.bought_last_month}+` : undefined),
          sub_sub_category_id: p.sub_sub_category_id ?? 0,
        };
      });
    }

    return [];
  }, [products, fallback_products]);

  const { data: section_data } = useSectionProducts({
    section: "trending-products",
    limit: 20,
  });

  const final_products = useMemo<IHomeProduct[]>(() => {
    if (formatted_products.length > 0) return formatted_products;

    // 3. From async section query fallback
    return (
      section_data?.pages?.flatMap((page) =>
        (page.products ?? []).map((p: any) => {
          const first_variant = p.variants?.[0] ?? {};
          const first_media =
            first_variant.variant_medias?.[0]?.media?.url ??
            p.product_medias?.[0]?.media?.url ??
            p.media_url ??
            "";
          const selling_price = Number(
            first_variant.variant_pricing?.selling_price_with_commission ??
            first_variant.variant_pricing?.selling_price ??
            p.selling_price_with_commission ??
            p.selling_price ??
            0
          ) || 0;
          const mrp = Number(
            first_variant.variant_pricing?.mrp ??
            first_variant.mrp ??
            p.variant_pricing?.mrp ??
            p.mrp ??
            0
          ) || 0;

          const review_count_val =
            p.reviews_count ??
            p.ratings_count ??
            p.rating_count ??
            p.total_reviews;

          return {
            product_id: p.id ?? p.product_id,
            variant_id: first_variant.id ?? p.variant_id ?? 0,
            title: p.title,
            media_url: first_media,
            selling_price,
            mrp,
            discount_percentage:
              mrp > selling_price && mrp > 0
                ? Math.round(((mrp - selling_price) / mrp) * 100)
                : 0,
            avg_rating: p.avg_rating ?? p.average_rating ?? 0,
            rating_count:
              review_count_val != null && Number(review_count_val) > 0
                ? review_count_val
                : p.bought_last_month
                  ? `${p.bought_last_month}+`
                  : undefined,
            sub_sub_category_id: p.sub_sub_category_id ?? 0,
          };
        }),
      ) ?? []
    );
  }, [formatted_products, section_data]);

  if (final_products.length === 0) return null;

  return (
    <HomeProductRow
      title="Deals of the day"
      subtitle="Explore today's best discounted products and limited-time offers"
      products={final_products}
      background_style="bg-gradient-to-r from-orange-100/90 via-orange-50 to-orange-100/90 border border-orange-200/80 shadow-xs"
      CardComponent={HomeProductCard}
    />
  );
};

export default BestDeals;
