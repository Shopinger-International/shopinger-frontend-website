import type { FC } from "react";
import type IMedia from "@/types/media";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

// icons
import { Heart, ChevronRight, ChevronDown } from "lucide-react";

// local components
import Rating from "@/components/common/rating.component";
import RatingSummaryPopover from "@/components/categories/rating-summary-popover.component";
import ProductCardQuantityControl from "./product-card-quantity-control.component";

// api hooks & helpers
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useAddToWishlistMutation from "@/hooks/axios/wishlist/use-add-to-wishlist-mutation.hook";
import useRemoveFromWishlistMutation from "@/hooks/axios/wishlist/use-remove-from-wishlist-mutation.hook";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
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
  is_wishlisted,
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
  const is_mobile = useIsMobile();

  return (
    <div className="group relative flex h-full min-w-0 flex-col justify-between overflow-hidden rounded-lg border border-gray-200 bg-white sm:rounded-xl sm:border-gray-300">
      <div className="flex flex-1 flex-col justify-between">
        <div className="absolute z-1 mt-2 w-full">
          {!!discount_percentage && (
            <span className="absolute left-2 rounded-full border border-gray-300 bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm sm:px-3 sm:py-1 sm:text-xs">
              -{Math.round(Number(discount_percentage))}%
            </span>
          )}
          <button
            aria-label="Add to wishlist"
            className="absolute right-2 shrink-0 cursor-pointer rounded-full border border-gray-300 bg-white p-1 shadow-sm disabled:bg-gray-100"
            disabled={
              add_to_wishlist_mutation.isPending ||
              remove_from_wishlist_mutation.isPending
            }
            onClick={() =>
              is_wishlisted
                ? remove_from_wishlist_mutation.mutate(
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
                    },
                  )
                : add_to_wishlist_mutation.mutate(
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
                    },
                  )
            }
          >
            <Heart
              aria-hidden={true}
              className={clsx(
                "size-4 text-orange-500 sm:size-6",
                is_wishlisted && "fill-orange-500",
              )}
              strokeWidth={2}
            />
          </button>
        </div>
        <Link
          title={`View ${title}`}
          aria-label={`View product ${title}`}
          href={{
            pathname: src,
            query: {
              ...(query_id && { query_id }),
              ...(index_name && { index_name }),
              ...(object_id && { object_id }),
            },
          }}
          className="flex flex-1 flex-col justify-between"
        >
          <div className="relative aspect-square overflow-hidden border-b border-gray-200 bg-gray-100 sm:aspect-3/2 sm:border-gray-300">
            <Image
              priority={index <= 3}
              src={
                typeof product_thumbnail !== "string"
                  ? product_thumbnail.url
                  : product_thumbnail
              }
              alt={`${title}`}
              fill
              className="object-contain object-top"
              sizes="(max-width: 640px) 50vw, 300px"
            />

            {is_new && (
              <span className="absolute right-0 bottom-2 overflow-hidden bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow">
                NEW
                <span className="absolute top-0 -left-2 h-full w-3 skew-x-[-20deg] bg-orange-600" />
              </span>
            )}
          </div>

          {/* content */}
          <div className="flex flex-1 flex-col space-y-1.5 p-2 sm:space-y-2 sm:p-4">
            <h3 className="line-clamp-2 min-h-[2.1rem] text-xs leading-4 font-medium text-gray-900 sm:min-h-[2.5rem] sm:text-base sm:leading-normal">
              {title}
            </h3>

            {/* rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium sm:text-base">
                  {avg_rating?.toFixed(1)}
                </span>
                <Rating
                  total_stars={5}
                  custom_rating={avg_rating}
                  size={is_mobile ? 14 : 16}
                  gap={0.5}
                />
                <RatingSummaryPopover
                  product_id={product_id}
                  product_reviews_link={product_reviews_link}
                >
                  <button
                    aria-label="View rating details"
                    className="text-orange-500"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <ChevronDown
                      aria-hidden={true}
                      className="size-5"
                      strokeWidth={2.5}
                    />
                  </button>
                </RatingSummaryPopover>
              </div>
            </div>
            {!!bought_last_month && (
              <p className="text-[10px] font-medium text-gray-700 sm:text-sm">
                {bought_last_month} bought recently
              </p>
            )}

            {/* price */}
            <div className="flex items-center gap-2">
              {!!discount_percentage && (
                <span className="text-sm font-medium text-gray-600 line-through sm:text-base">
                  ₹{mrp?.toLocaleString()}
                </span>
              )}
              <span className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                ₹{selling_price.toLocaleString()}
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-auto px-2 pb-2 sm:px-4 sm:pb-4">
        <div className="w-full">
          {have_variants ? (
            <Link
              aria-label={`See all options`}
              href={{
                pathname: src,
                query: {
                  ...(query_id && { query_id }),
                  ...(index_name && { index_name }),
                  ...(object_id && { object_id }),
                },
              }}
              className="flex w-full items-center justify-center gap-0.5 rounded-md border border-gray-300 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 sm:gap-1 sm:rounded-xl sm:py-2.5 sm:text-sm"
            >
              <span>See all options</span>
              <ChevronRight aria-hidden={true} className="size-4 sm:size-5" />
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
