import { useState } from "react";
import type { FC } from "react";
import type IMedia from "@/types/media";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

// icons
import { Heart, ChevronRight, Star, ArrowDown } from "lucide-react";

// local components
import RatingSummaryPopover from "@/components/categories/rating-summary-popover.component";
import ProductCardQuantityControl from "./product-card-quantity-control.component";

// api hooks & helpers
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useAddToWishlistMutation from "@/hooks/axios/wishlist/use-add-to-wishlist-mutation.hook";
import useRemoveFromWishlistMutation from "@/hooks/axios/wishlist/use-remove-from-wishlist-mutation.hook";
import addedToWishlistEvent from "@/analytics/events/added-to-wishlist.event";
import removedFromWishlistEvent from "@/analytics/events/removed-from-wishlist.event";
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";
import clsx from "clsx";

type IProps = {
  product_id: number;
  variant_id: number;
  title: string;
  src: string;
  product_thumbnail: IMedia | string;
  selling_price: number;
  mrp: number;
  discount_percentage: number;
  is_new: boolean;
  have_variants: boolean;
  product_reviews_link: string;
  avg_rating: number;
  bought_last_month: number;
  is_wishlisted: boolean;
  sub_sub_category_id: number;
  index: number;
};

const ProductCard: FC<IProps> = ({
  product_id,
  variant_id,
  title,
  src,
  product_thumbnail,
  selling_price,
  mrp,
  discount_percentage,
  is_new,
  have_variants,
  product_reviews_link,
  avg_rating,
  is_wishlisted: initial_is_wishlisted,
  sub_sub_category_id,
  bought_last_month,
  index,
}) => {
  const { data: user_details } = useUserDetails();
  const user_id = user_details?.id;
  const add_to_wishlist_mutation = useAddToWishlistMutation();
  const remove_from_wishlist_mutation = useRemoveFromWishlistMutation();
  const router = useRouter();
  const query = router.query;
  const query_id =
    typeof query.query_id === "string" ? query.query_id : undefined;
  const index_name =
    typeof query.index_name === "string" ? query.index_name : undefined;
  const object_id =
    typeof query.object_id === "string" ? query.object_id : undefined;

  const is_grocery =
    router.asPath.toLowerCase().includes("grocery") ||
    router.query.main_category_slug?.toString().toLowerCase().includes("grocery");
  const is_pharmacy =
    router.asPath.toLowerCase().includes("pharmacy") ||
    router.asPath.toLowerCase().includes("personal-care") ||
    router.asPath.toLowerCase().includes("health") ||
    router.query.main_category_slug?.toString().toLowerCase().includes("pharmacy") ||
    router.query.main_category_slug?.toString().toLowerCase().includes("personal-care") ||
    router.query.main_category_slug?.toString().toLowerCase().includes("health");

  const [local_wishlisted, setLocalWishlisted] = useState<boolean | null>(null);
  const is_wishlisted =
    local_wishlisted !== null ? local_wishlisted : initial_is_wishlisted;

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

  const media_url =
    typeof product_thumbnail === "string"
      ? product_thumbnail
      : product_thumbnail?.url ?? "/shopinger-logo.svg";

  const product_href = {
    pathname: src,
    query: {
      ...(query_id && { query_id }),
      ...(index_name && { index_name }),
      ...(object_id && { object_id }),
    },
  };

  return (
    <div
      className={clsx(
        "group relative flex h-full w-full flex-col justify-between rounded-2xl p-2 sm:p-2.5 bg-white border transition-all duration-200",
        is_grocery
          ? "border-green-100/60 lg:border-orange-100/60"
          : is_pharmacy
            ? "border-blue-100/60 lg:border-orange-100/60"
            : "border-orange-100/60",
      )}
    >
      <div className="flex flex-1 flex-col justify-between">
        {/* Top Image Container & Details */}
        <Link
          href={product_href}
          title={`View ${title}`}
          aria-label={`View product ${title}`}
          className="block w-full"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white flex items-center justify-center">
            {/* Top-Left Discount Badge */}
            {discount_percentage > 0 && (
              <span
                className={clsx(
                  "absolute top-0 left-0 z-10 rounded-tl-xl rounded-br-lg bg-white px-2 py-0.5 text-xs font-extrabold tracking-tight uppercase shadow-2xs",
                  is_grocery
                    ? "text-green-600 lg:text-brand"
                    : is_pharmacy
                      ? "text-blue-500 lg:text-brand"
                      : "text-brand",
                )}
              >
                <span className="inline-flex items-center gap-0.5">
                  {Math.round(Number(discount_percentage))}%
                  <ArrowDown className="size-3 shrink-0" strokeWidth={3.5} />
                </span>
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
              className="absolute top-1.5 right-1.5 z-10 flex size-8 sm:size-9 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-brand shadow-2xs transition-transform active:scale-95"
            >
              <Heart
                className={clsx(
                  "size-5 sm:size-6",
                  is_grocery
                    ? "text-green-600 lg:text-brand"
                    : is_pharmacy
                      ? "text-blue-600 lg:text-brand"
                      : "text-brand",
                  is_wishlisted &&
                  (is_grocery
                    ? "fill-green-600 lg:fill-brand"
                    : is_pharmacy
                      ? "fill-blue-600 lg:fill-brand"
                      : "fill-brand"),
                )}
                strokeWidth={2.2}
              />
            </button>

            {/* Product Image */}
            <div className="relative h-full w-full">
              <Image
                priority={index <= 3}
                src={media_url}
                alt={title}
                fill
                sizes="(max-width: 640px) 140px, 180px"
                className="object-contain p-1 transition-transform duration-300 rounded-2xl"
              />
            </div>

            {/* Bottom-Left Rating Overlay */}
            {avg_rating != null && Number(avg_rating) > 0 && (
              <RatingSummaryPopover
                product_id={product_id}
                product_reviews_link={product_reviews_link}
              >
                <button
                  type="button"
                  aria-label="View rating details"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  className="absolute bottom-1.5 left-1.5 z-10 flex items-center gap-1 rounded-md bg-rating px-1.5 py-0.5 text-2xs font-bold text-white shadow-2xs cursor-pointer hover:opacity-90"
                >
                  <span>{Number(avg_rating).toFixed(1)}</span>
                  <Star className="size-2.5 fill-white text-white" />
                </button>
              </RatingSummaryPopover>
            )}
          </div>

          {/* Title */}
          <h3 className="mt-2 line-clamp-2 text-2xs font-semibold leading-snug text-gray-900 sm:text-xs">
            {title}
          </h3>

          {/* Bought last month info */}
          {!!bought_last_month && (
            <p className="mt-0.5 text-3xs sm:text-2xs font-medium text-gray-500 line-clamp-1">
              {bought_last_month} bought recently
            </p>
          )}
        </Link>
      </div>

      {/* Price and Action Row (Fixed at Bottom) */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-1 pt-2">
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
            aria-label="See all options"
            href={product_href}
            className="flex h-7 sm:h-9 w-full min-[230px]:w-auto shrink-0 items-center justify-center gap-0.5 rounded-lg border border-gray-300 bg-white px-2 text-2xs font-medium text-gray-900 transition-colors hover:bg-gray-100 sm:rounded-xl sm:px-3 sm:text-xs"
          >
            <span>See options</span>
            <ChevronRight className="size-3.5 shrink-0" />
          </Link>
        ) : (
          <ProductCardQuantityControl
            product_id={product_id}
            variant_id={variant_id}
            user_id={user_id}
            sub_sub_category_id={sub_sub_category_id}
            selling_price={selling_price}
            mrp={mrp}
            query_id={query_id}
            index_name={index_name}
            object_id={object_id}
            fullWidth={selling_price <= 0}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
