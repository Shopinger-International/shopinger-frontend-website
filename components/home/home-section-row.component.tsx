import { useMemo } from "react";
import type { FC } from "react";

// hooks
import useSectionProducts from "@/hooks/axios/home/use-section-products.hook";

// local components
import HomeProductRow from "@/components/home/home-product-row.component";
import HomeProductCard, {
  type IHomeProduct,
} from "@/components/home/home-product-card.component";

type IProps = {
  title: string;
  section: string;
  initial_products?: Array<IHomeProduct>;
  view_all_href?: string;
  background_style?: string;
};

const HomeSectionRow: FC<IProps> = ({
  title,
  section,
  initial_products = [],
  view_all_href,
  background_style,
}) => {
  const { data: section_data } = useSectionProducts({
    section,
    limit: 20,
  });

  const combined_products = useMemo(() => {
    const fetched_products: IHomeProduct[] =
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
            p.price ??
            0
          ) || 0;
          const mrp = Number(
            first_variant.variant_pricing?.mrp ??
            first_variant.mrp ??
            p.variant_pricing?.mrp ??
            p.mrp ??
            p.original_price ??
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
      ) ?? [];

    // Deduplicate between initial feed products and section API products
    const map = new Map<string, IHomeProduct>();

    for (const p of initial_products) {
      if (p.product_id) {
        map.set(`${p.product_id}-${p.variant_id}`, p);
      }
    }

    for (const p of fetched_products) {
      if (p.product_id && !map.has(`${p.product_id}-${p.variant_id}`)) {
        map.set(`${p.product_id}-${p.variant_id}`, p);
      }
    }

    return Array.from(map.values());
  }, [initial_products, section_data]);

  if (combined_products.length === 0) return null;

  return (
    <HomeProductRow
      title={title}
      products={combined_products}
      view_all_href={view_all_href}
      background_style={background_style}
      CardComponent={HomeProductCard}
    />
  );
};

export default HomeSectionRow;
