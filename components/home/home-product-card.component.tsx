import { useState, useEffect, memo } from "react";
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
import useIsWishlisted from "@/hooks/axios/wishlist/use-is-wishlisted";

// sub-components
import HomeProductQuantityControl from "@/components/home/home-product-quantity-control.component";

// helpers & analytics
import { generateSlug } from "@/helpers/product.helper";
import { extractProductPrices,extractProductRating} from "@/helpers/home-product-card.helper";
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

  const { data: user_details } = useUserDetails();
  const user_id = user_details?.id;

  const { data: wishlist_data } = useIsWishlisted({
    variant_id,
    enabled: !!variant_id,
  });

  const [local_wishlisted, setLocalWishlisted] = useState<boolean | null>(null);

  const is_wishlisted =
    local_wishlisted !== null
      ? local_wishlisted
      : (wishlist_data?.is_wishlisted ?? product.is_wishlisted ?? initial_wishlisted);

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
        "group relative flex h-full w-full flex-col justify-between rounded-2xl p-2 sm:p-2.5 border border-orange-100/60",
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
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white flex items-center justify-center ">
            {/* Top-Left Discount Badge */}
            {discount_perc > 0 && (
              <span className="absolute top-0 left-0 z-10 rounded-tl-xl rounded-br-lg bg-white px-2 py-0.5 text-xs font-extrabold text-brand tracking-tight uppercase inline-flex items-center gap-0.5">
                <span>{discount_perc}%</span>
                <ArrowDown className="size-3 shrink-0 text-brand" strokeWidth={3.5} />
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
              className="absolute top-1.5 right-1.5 z-10 flex size-8 sm:size-9 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-brand transition-transform active:scale-95"
            >
              <Heart
                className={clsx(
                  "size-5 sm:size-6 text-brand",
                  is_wishlisted && "fill-brand",
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
                className="object-contain p-1 transition-transform duration-300 rounded-2xl pointer-events-none select-none"
              />
            </div>

            {/* Bottom-Left Rating Overlay */}
            {avg_rating != null && Number(avg_rating) > 0 && (
              <div className="absolute bottom-1.5 left-1.5 z-10 flex items-center gap-1 rounded-md bg-rating-green px-1.5 py-0.5 text-2xs font-bold text-white">
                <span>{Number(avg_rating).toFixed(1)}</span>
                <Star className="size-2.5 fill-white text-white" />
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="mt-2 line-clamp-2 text-2xs font-semibold leading-snug text-gray-900 sm:text-xs">
            {title}
          </h3>
        </Link>
      </div>

      {/* Price and Action Row (Fixed at Bottom) */}
      <div className="mt-auto flex items-center justify-between gap-1 pt-2">
        {Number(selling_price) > 0 && (
          <div className="flex flex-col min-w-0 gap-0">
            <span className="text-sm font-black text-gray-900 sm:text-base md:text-lg leading-tight truncate">
              ₹{Number(selling_price).toLocaleString()}
            </span>
            {Number(mrp) > Number(selling_price) && Number(mrp) > 0 && (
              <span className="text-2xs font-medium text-gray-400 line-through leading-tight sm:text-xs truncate">
                ₹{Number(mrp).toLocaleString()}
              </span>
            )}
          </div>
        )}
        {have_variants ? (
          <Link
            href={product_href}
            aria-label="See options"
            className="flex h-7 sm:h-9 shrink-0 items-center justify-center gap-0.5 rounded-lg border border-gray-300 bg-white px-2 text-2xs font-bold text-gray-900 transition-colors hover:bg-gray-100 sm:rounded-xl sm:px-3 sm:text-xs"
          >
            <span>See options</span>
            <ChevronRight className="size-3.5 shrink-0" />
          </Link>
        ) : (
          <HomeProductQuantityControl
            product_id={product_id}
            variant_id={variant_id}
            user_id={user_id}
            sub_sub_category_id={sub_sub_category_id}
            fullWidth={selling_price <= 0}
          />
        )}
      </div>
    </div>
  );
};

export default memo(HomeProductCard);
