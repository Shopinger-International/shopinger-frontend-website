import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import clsx from "clsx";

// types
import type { FC } from "react";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";

// icons
import { ChevronLeft, Heart, Share } from "lucide-react";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useIsWishlisted from "@/hooks/axios/wishlist/use-is-wishlisted";
import useAddToWishlistMutation from "@/hooks/axios/wishlist/use-add-to-wishlist-mutation.hook";
import useRemoveFromWishlistMutation from "@/hooks/axios/wishlist/use-remove-from-wishlist-mutation.hook";

// analytics
import addedToWishlistEvent from "@/analytics/events/added-to-wishlist.event";
import removedFromWishlistEvent from "@/analytics/events/removed-from-wishlist.event";
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";

type IProps = {
  product: IProduct;
  variant: IVariant;
};

const MobileProductStickyHeader: FC<IProps> = ({ product, variant }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const { data: user_details } = useUserDetails();
  const user_id = user_details?.id;

  const add_to_wishlist_mutation = useAddToWishlistMutation();
  const remove_from_wishlist_mutation = useRemoveFromWishlistMutation();
  const { data: wishlist_data } = useIsWishlisted({ variant_id: variant?.id });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!product || !variant) return null;

  const { title, brand } = product;
  const updated_title =
    !brand || brand.toLocaleLowerCase() == "generic" || title.includes(brand)
      ? title
      : `${brand} ${title}`;

  const variant_medias = variant.variant_medias.map(({ media }) => media);
  const image_url =
    variant_medias[0]?.url ?? product.product_medias[0]?.media?.url;

  const { mrp, selling_price_with_commission } = variant.variant_pricing;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: updated_title,
          text: `Check out ${updated_title} on Shopinger`,
          url: window.location.href,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  return (
    <div
      className={clsx(
        "fixed top-0 inset-x-0 z-50 flex items-center justify-between border-b border-gray-200/80 bg-white/95 px-3 py-2 transition-all duration-300 backdrop-blur-md shadow-xs lg:hidden",
        show
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none",
      )}
    >
      {/* Left: Back button + Product Image + Title & Prices */}
      <div className="flex items-center min-w-0 flex-1 gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-transform active:scale-95"
        >
          <ChevronLeft className="size-5 stroke-[2.5]" />
        </button>

        {image_url && (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
            <Image
              src={image_url}
              alt={updated_title}
              fill
              sizes="40px"
              className="object-contain p-0.5"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h2 className="truncate text-xs font-semibold text-gray-900 leading-tight">
            {updated_title}
          </h2>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-xs font-bold text-gray-900">
              ₹{selling_price_with_commission.toLocaleString("en-IN")}
            </span>
            {mrp > selling_price_with_commission && (
              <span className="text-[11px] text-gray-400 line-through font-normal">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Wishlist (Like) and Share buttons */}
      <div className="flex shrink-0 items-center gap-1.5 ml-2">
        <button
          type="button"
          aria-label={
            wishlist_data?.is_wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          title={
            wishlist_data?.is_wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-transform active:scale-95"
          disabled={
            add_to_wishlist_mutation.isPending ||
            remove_from_wishlist_mutation.isPending
          }
          onClick={() => {
            wishlist_data?.is_wishlisted
              ? remove_from_wishlist_mutation.mutate(
                  { variant_id: variant.id },
                  {
                    onSuccess() {
                      removedFromWishlistEvent({
                        user_id,
                        product_id: product.id,
                        variant_id: variant.id,
                        category_id: product.sub_sub_category_id,
                        category_type: "SUB_SUB",
                        source: ANALYTICS_SOURCE_TYPE.PRODUCT_DETAILS,
                      });
                    },
                  },
                )
              : add_to_wishlist_mutation.mutate(
                  { variant_id: variant.id },
                  {
                    onSuccess() {
                      addedToWishlistEvent({
                        user_id,
                        product_id: product.id,
                        variant_id: variant.id,
                        category_id: product.sub_sub_category_id,
                        category_type: "SUB_SUB",
                        source: ANALYTICS_SOURCE_TYPE.PRODUCT_DETAILS,
                      });
                    },
                  },
                );
          }}
        >
          <Heart
            aria-hidden={true}
            className={clsx(
              "size-4 text-orange-500",
              wishlist_data?.is_wishlisted && "fill-orange-500",
            )}
            strokeWidth={2}
          />
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share Product"
          title="Share Product"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-transform active:scale-95"
        >
          <Share className="size-4 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};

export default MobileProductStickyHeader;
