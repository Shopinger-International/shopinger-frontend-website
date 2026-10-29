import { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

// icons
import { Heart, Star, ChevronRight, ArrowDown } from "lucide-react";

// types
import type { IProductRecommendation } from "@/hooks/axios/home/use-feed.hook";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useAddToWishlistMutation from "@/hooks/axios/wishlist/use-add-to-wishlist-mutation.hook";
import useRemoveFromWishlistMutation from "@/hooks/axios/wishlist/use-remove-from-wishlist-mutation.hook";

// sub-components
import HomeProductQuantityControl from "@/components/home/home-product-quantity-control.component";

// helpers & analytics
import { generateSlug } from "@/helpers/product.helper";
import {
  extractProductPrices,
  extractProductRating,
} from "@/helpers/home-product-card.helper";
import addedToWishlistEvent from "@/analytics/events/added-to-wishlist.event";
import removedFromWishlistEvent from "@/analytics/events/removed-from-wishlist.event";
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";
import clsx from "clsx";

export type IHomeProduct = IProductRecommendation & {
  selling_price?: number;
  mrp?: number;
  discount_percentage?: number;
  discount?: number;
  avg_rating?: number;
  rating?: number;
  average_rating?: number;
  rating_count?: string | number;
  ratings_count?: string | number;
  reviews_count?: string | number;
  is_wishlisted?: boolean;
  sub_sub_category_id?: number;
  have_variants?: boolean;
};

interface IHomeProductCardProps {
  product: IHomeProduct;
  className?: string;
}

// Main Home Product Card Component
const HomeProductCard: FC<IHomeProductCardProps> = ({ product, className }) => {
  const first_variant = (product as any)?.variants?.[0] ?? {};
  const product_id = product.product_id ?? (product as any)?.id;
  const variant_id = product.variant_id ?? first_variant?.id ?? 0;

  const raw_media =
    product.media_url ??
    (product as any)?.product_thumbnail ??
    (product as any)?.thumbnail ??
    (product as any)?.image ??
    first_variant?.variant_medias?.[0]?.media?.url ??
    (product as any)?.product_medias?.[0]?.media?.url ??
    (product as any)?.medias?.[0]?.url;

  const media_url =
    typeof raw_media === "string" && raw_media.trim()
      ? raw_media.trim()
      : typeof (raw_media as any)?.url === "string"
        ? (raw_media as any).url
        : "/shopinger-logo.svg";

  const {
    title = "",
    is_wishlisted: initial_wishlisted = false,
    sub_sub_category_id = 0,
  } = product;

  const { selling_price, mrp, discount_perc } = extractProductPrices(product);
  const { avg_rating } = extractProductRating(product);
  const rating_count =
    product.reviews_count ?? product.ratings_count ?? product.rating_count;

  const { data: user_details } = useUserDetails();
  const user_id = user_details?.id;

  const [local_wishlisted, setLocalWishlisted] = useState<boolean | null>(null);

  const is_wishlisted =
    local_wishlisted !== null
      ? local_wishlisted
      : (product.is_wishlisted ?? initial_wishlisted);

  const add_to_wishlist_mutation = useAddToWishlistMutation();
  const remove_from_wishlist_mutation = useRemoveFromWishlistMutation();

  const product_slug = generateSlug(title);
  const product_href = `/${product_slug}/p/${product_id}/${variant_id}`;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (is_wishlisted) {
      setLocalWishlisted(false);
      remove_from_wishlist_mutation.mutate(
        { variant_id },
        {
          onSuccess() {
            removedFromWishlistEvent({
              user_id,
              product_id,
              variant_id,
              category_id: sub_sub_category_id,
              category_type: "SUB_SUB",
              source: ANALYTICS_SOURCE_TYPE.CATEGORY,
            });
          },
          onError() {
            setLocalWishlisted(true);
          },
        },
      );
    } else {
      setLocalWishlisted(true);
      add_to_wishlist_mutation.mutate(
        { variant_id },
        {
          onSuccess() {
            addedToWishlistEvent({
              user_id,
              product_id,
              variant_id,
              category_id: sub_sub_category_id,
              category_type: "SUB_SUB",
              source: ANALYTICS_SOURCE_TYPE.CATEGORY,
            });
          },
          onError() {
            setLocalWishlisted(false);
          },
        },
      );
    }
  };

  const have_variants =
    product.have_variants ??
    (product as any).has_variants ??
    ((product as any).variants &&
      Array.isArray((product as any).variants) &&
      (product as any).variants.length > 1) ??
    false;

  return (
    <div
      className={clsx(
        "group relative flex h-full w-full flex-col justify-between rounded-2xl border border-orange-100/60",
        className,
      )}
    >
      <div className="flex flex-1 flex-col justify-between">
        {/* Top Image Container & Details */}
        <Link
          href={product_href}
          title={`View ${title}`}
          className="block w-full"
        >
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white">
            {/* Top-Left Discount Badge */}
            {discount_perc > 0 && (
              <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-0.5 rounded-tl-xl rounded-br-lg bg-green-700 px-2 py-0.5 text-xs font-semibold tracking-tight text-white uppercase">
                <span>{discount_perc}%</span>
                <ArrowDown
                  className="size-3 shrink-0 text-white"
                  strokeWidth={3.5}
                />
              </span>
            )}

            {/* Top-Right Wishlist Heart Button */}
            <button
              type="button"
              aria-label="Add to wishlist"
              disabled={
                add_to_wishlist_mutation.isPending ||
                remove_from_wishlist_mutation.isPending
              }
              onClick={handleWishlistClick}
              className="absolute top-1.5 right-1.5 z-10 flex size-4 cursor-pointer items-center justify-center text-gray-500 transition-transform active:scale-95 sm:size-5"
            >
              <Heart
                className={clsx(
                  "size-5 sm:size-6",
                  is_wishlisted ? "text-brand fill-brand" : "fill-white",
                )}
                strokeWidth={2.2}
              />
            </button>

            {/* Product Image */}
            <div className="relative h-full w-full">
              <Image
                src={media_url}
                alt={title}
                fill
                sizes="(max-width: 640px) 140px, 180px"
                className="pointer-events-none rounded-2xl object-contain p-1 transition-transform duration-300 select-none"
              />
            </div>
          </div>

          <div className="p-2">
            {/* Title */}
            <h3 className="text-2xs px-2s mt-2 line-clamp-2 leading-snug font-semibold text-gray-900 sm:text-xs">
              {title}
            </h3>
            {avg_rating !== undefined && (
              <div
                className="mt-1 flex w-full min-w-0 items-center gap-1 px-2 text-[10px] sm:text-xs"
                role="img"
                aria-label={`${avg_rating.toFixed(1)} out of 5 stars${rating_count != null ? `, ${rating_count} ratings` : ""}`}
              >
                <span className="shrink-0 font-medium text-gray-700">
                  {avg_rating.toFixed(1)}
                </span>
                <span
                  className="flex shrink-0 items-center gap-0.5"
                  aria-hidden="true"
                >
                  {Array.from({ length: 5 }, (_, index) => {
                    const fill_percentage =
                      Math.min(Math.max(avg_rating - index, 0), 1) * 100;

                    return (
                      <span key={index} className="relative inline-flex">
                        <Star className="size-2.5 text-gray-300 sm:size-3" />
                        <span
                          className="absolute inset-y-0 left-0 overflow-hidden"
                          style={{ width: `${fill_percentage}%` }}
                        >
                          <Star className="fill-rating-green text-rating-green size-2.5 sm:size-3" />
                        </span>
                      </span>
                    );
                  })}
                </span>
                {rating_count != null && (
                  <span className="min-w-0 font-medium">({rating_count})</span>
                )}
              </div>
            )}
            {/* Price and Action Row */}
            <div className="mt-auto flex w-full items-center justify-between gap-2 pt-3">
              {/* Price */}
              <div className="flex shrink-0 flex-col gap-0.5">
                {Number(selling_price) > 0 ? (
                  <>
                    <span className="text-xs leading-tight font-semibold whitespace-nowrap text-gray-900 sm:text-sm md:text-base">
                      ₹{Number(selling_price).toLocaleString("en-IN")}
                    </span>

                    {Number(mrp) > Number(selling_price) && Number(mrp) > 0 && (
                      <span className="truncate text-[10px] leading-tight font-normal text-gray-400 line-through sm:text-xs">
                        ₹{Number(mrp).toLocaleString("en-IN")}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-gray-400">
                    Price unavailable
                  </span>
                )}
              </div>

              {/* Action */}
              <div className="w-auto shrink-0">
                {have_variants ? (
                  <Link
                    href={product_href}
                    aria-label={`See options for ${title}`}
                    className="border-brand text-brand flex h-8 items-center justify-center gap-1 rounded-lg border bg-orange-50 px-2 text-xs font-bold transition-colors hover:bg-orange-100 active:scale-[0.98] sm:h-9 sm:px-3"
                  >
                    <span>Options</span>
                    <ChevronRight className="size-4 shrink-0" />
                  </Link>
                ) : (
                  <HomeProductQuantityControl
                    product_id={product_id}
                    variant_id={variant_id}
                    user_id={user_id}
                    sub_sub_category_id={sub_sub_category_id}
                  />
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default memo(HomeProductCard);
