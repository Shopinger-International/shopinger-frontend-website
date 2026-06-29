import { useRouter } from "next/router";

// const
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";

// types
import type { FC } from "react";
import type IMedia from "@/types/media";

// next
import Image from "next/image";
import Link from "next/link";

// icons
import { Heart, ChevronRight, ChevronDown } from "lucide-react";

// local components
import Rating from "@/components/common/rating.component";
import RatingSummaryPopover from "@/components/categories/rating-summary-popover.component";

// api hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";

// lib
import insightsClient from "@/lib/algolia/algolia-insight.lib";

// analytics events
import addedToCartEvent from "@/analytics/events/added-to-cart.event";

type IProps = {
  product_id: number;
  variant_id: number;
  title: string;
  src: string;
  product_thumbnail: IMedia;
  selling_price: number;
  mrp: number;
  discount_percentage: number;
  is_new: boolean;
  have_variants: boolean;
  total_reviews: number;
  product_reviews_link: string;
  avg_rating: number;
  bought_last_month: number;
  sub_sub_category_id: number;
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
  total_reviews,
  product_reviews_link,
  avg_rating,
  sub_sub_category_id,
  bought_last_month
}) => {
  const { data: user_details } = useUserDetails();
  const user_id = user_details?.id;
  const add_to_cart_mutation = useAddToCartMutation();
  const router = useRouter();
  const query = router.query;
  const query_id =
    typeof query.query_id === "string" ? query.query_id : undefined;

  const index_name =
    typeof query.index_name === "string" ? query.index_name : undefined;

  const object_id =
    typeof query.object_id === "string" ? query.object_id : undefined;
  return (
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
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white"
    >
      <div className="relative aspect-3/2 overflow-hidden border-b border-gray-300 bg-gray-100">
        <Image
          src={product_thumbnail.url}
          alt={`${title} product image`}
          fill
          className="object-contain object-top"
          sizes="300px"
        />

        <div className="absolute mt-2 w-full">
          {!!discount_percentage && (
            <span className="absolute left-2 rounded-full border border-gray-300 bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              -{discount_percentage}%
            </span>
          )}
          <button className="absolute right-2 shrink-0 rounded-full border border-gray-300 bg-white p-1 shadow-sm">
            <Heart className="size-6 text-orange-500" strokeWidth={2} />
          </button>
        </div>
        {is_new && (
          <span className="absolute right-0 bottom-2 overflow-hidden bg-orange-500 px-3 py-1 text-[10px] font-bold text-white shadow">
            NEW
            <span className="absolute top-0 -left-2 h-full w-3 skew-x-[-20deg] bg-orange-600" />
          </span>
        )}
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="line-clamp-2 font-medium text-gray-900">{title}</h3>

        {/* rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-base font-medium">
              {avg_rating.toFixed(1)}
            </span>
            <Rating
              totalStars={5}
              custom_rating={avg_rating}
              onChange={() => {}}
              size={16}
              gap={0.5}
            />
            <RatingSummaryPopover
              product_id={product_id}
              product_reviews_link={product_reviews_link}
            >
              <button className="text-orange-500">
                <ChevronDown className="size-5" strokeWidth={2.5} />
              </button>
            </RatingSummaryPopover>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-700">
          {bought_last_month} bought in last month
        </p>
        {/* price */}
        <div className="flex items-center gap-2">
          {!!discount_percentage && (
            <span className="font-medium text-gray-600 line-through">
              ₹{mrp?.toLocaleString()}
            </span>
          )}
          <span className="font-semibold text-gray-900">
            ₹{selling_price.toLocaleString()}
          </span>
        </div>
        <div className="mt-auto">
          {have_variants ? (
            <button className="flex w-full items-center justify-center gap-1 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100">
              <span>See all options</span>
              <ChevronRight className="size-5" />
            </button>
          ) : (
            <button
              className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:bg-orange-300"
              disabled={add_to_cart_mutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                add_to_cart_mutation.mutate(
                  {
                    product_id: product_id,
                    variant_id: variant_id,
                    quantity: 1,
                  },
                  {
                    onSuccess() {
                      addedToCartEvent({
                        user_id,
                        product_id,
                        variant_id,
                        category_id: sub_sub_category_id,
                        category_type: "SUB_SUB",
                        source: ANALYTICS_SOURCE_TYPE.CATEGORY,
                      });
                      query_id &&
                        index_name &&
                        object_id &&
                        insightsClient("addedToCartObjectIDsAfterSearch", {
                          eventName: "Add to Cart",
                          index: index_name,
                          queryID: query_id,
                          objectIDs: [object_id],
                          objectData: [
                            {
                              price: selling_price,
                              discount: mrp - selling_price,
                              quantity: 1,
                            },
                          ],
                          value: selling_price,
                          currency: "INR",
                        });
                    },
                  },
                );
              }}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
