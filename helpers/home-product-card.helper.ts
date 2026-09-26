import type { IHomeProduct } from "@/components/home/home-product-card.component";

export interface IExtractedPrices {
  selling_price: number;
  mrp: number;
  discount_perc: number;
}

export interface IExtractedRating {
  avg_rating: number | undefined;
  rating_count: string | number | undefined;
}

export function extractProductPrices(product: IHomeProduct): IExtractedPrices {
  if (!product) {
    return { selling_price: 0, mrp: 0, discount_perc: 0 };
  }

  const first_variant = (product as any).variants?.[0] ?? {};
  const first_pricing = first_variant.variant_pricing ?? (product as any).variant_pricing ?? {};

  // Extract selling price from all possible API structures
  const raw_selling_price =
    product.selling_price ??
    (product as any).selling_price_with_commission ??
    first_pricing.selling_price_with_commission ??
    first_pricing.selling_price ??
    first_variant.selling_price_with_commission ??
    first_variant.selling_price ??
    (product as any).price ??
    (product as any).special_price ??
    0;

  const selling_price = Number(raw_selling_price) || 0;

  // Extract MRP from all possible API structures
  const raw_mrp =
    product.mrp ??
    first_pricing.mrp ??
    first_variant.mrp ??
    (product as any).original_price ??
    (product as any).price ??
    selling_price;

  const mrp = Number(raw_mrp) || 0;

  // Calculate discount percentage ONLY when selling_price > 0 and mrp > selling_price
  let discount_perc = 0;

  if (selling_price > 0 && mrp > selling_price && mrp > 0) {
    discount_perc = Math.round(((mrp - selling_price) / mrp) * 100);
  } else if (
    selling_price > 0 &&
    product.discount_percentage != null &&
    Number(product.discount_percentage) > 0
  ) {
    discount_perc = Math.round(Number(product.discount_percentage));
  } else if (
    selling_price > 0 &&
    product.discount != null &&
    Number(product.discount) > 0
  ) {
    discount_perc = Math.round(Number(product.discount));
  }

  return {
    selling_price,
    mrp,
    discount_perc,
  };
}

export function extractProductRating(product: IHomeProduct): IExtractedRating {
  if (!product) {
    return { avg_rating: undefined, rating_count: undefined };
  }

  const avg_rating =
    product.avg_rating ?? product.rating ?? product.average_rating ?? undefined;

  const raw_rating_count =
    product.rating_count ??
    product.ratings_count ??
    product.reviews_count ??
    (product as any).total_reviews ??
    ((product as any).bought_last_month
      ? `${(product as any).bought_last_month}+`
      : undefined);

  return {
    avg_rating,
    rating_count: raw_rating_count,
  };
}
