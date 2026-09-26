import { useState, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

// icons
import { Heart, Star } from "lucide-react";

// types
import type { IProductRecommendation } from "@/hooks/axios/home/use-feed.hook";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";
import useAddToWishlistMutation from "@/hooks/axios/wishlist/use-add-to-wishlist-mutation.hook";
import useRemoveFromWishlistMutation from "@/hooks/axios/wishlist/use-remove-from-wishlist-mutation.hook";
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useCartItemIncreaseMutation from "@/hooks/axios/cart/use-cart-item-increase-mutation.hook";
import useCartItemDecreaseMutation from "@/hooks/axios/cart/use-cart-item-decrease-mutation.hook";
import useCartItemRemoveMutation from "@/hooks/axios/cart/use-cart-item-remove-mutation.hook";

// helpers & analytics
import { generateSlug } from "@/helpers/product.helper";
import { getProductAvailability } from "@/hooks/axios/product/use-get-product-availbility.hook";
import { enqueueSnackbar } from "notistack";
import addedToCartEvent from "@/analytics/events/added-to-cart.event";
import addedToWishlistEvent from "@/analytics/events/added-to-wishlist.event";
import removedFromWishlistEvent from "@/analytics/events/removed-from-wishlist.event";
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";
import clsx from "clsx";

export type IHomeProduct = IProductRecommendation & {
  selling_price?: number;
  mrp?: number;
  discount_percentage?: number;
  discount?: number;
  weight?: string;
  avg_rating?: number;
  rating?: number;
  average_rating?: number;
  rating_count?: string | number;
  ratings_count?: string | number;
  reviews_count?: string | number;
  is_wishlisted?: boolean;
  sub_sub_category_id?: number;
};

type IProps = {
  product: IHomeProduct;
  className?: string;
};

type IQuantityControlProps = {
  product_id: number;
  variant_id: number;
  user_id?: number;
  sub_sub_category_id?: number;
  fullWidth?: boolean;
};

const QuantityControl: FC<IQuantityControlProps> = memo(
  ({
    product_id,
    variant_id,
    user_id,
    sub_sub_category_id = 0,
    fullWidth = false,
  }) => {
    const { data: cart_data } = useCart();
    const add_to_cart_mutation = useAddToCartMutation();
    const increase_mutation = useCartItemIncreaseMutation();
    const decrease_mutation = useCartItemDecreaseMutation();
    const remove_mutation = useCartItemRemoveMutation();

    let cart_quantity = 0;
    if (cart_data?.items && Array.isArray(cart_data.items)) {
      for (const item of cart_data.items) {
        // 1. Check nested variants array
        if (Array.isArray(item.variants)) {
          const matched_variant = item.variants.find(
            (v: any) =>
              (v.id != null && Number(v.id) === Number(variant_id)) ||
              (v.variant_id != null && Number(v.variant_id) === Number(variant_id)),
          );
          if (matched_variant) {
            cart_quantity =
              matched_variant.selected_stock ??
              (matched_variant as any).quantity ??
              (matched_variant as any).qty ??
              1;
            break;
          }
        }

        // 2. Check flat item structure
        const item_var_id = (item as any).variant_id ?? (item as any).id;
        const item_prod_id = (item as any).product_id;

        if (
          (item_var_id != null && Number(item_var_id) === Number(variant_id)) ||
          (item_prod_id != null && Number(item_prod_id) === Number(product_id))
        ) {
          cart_quantity =
            (item as any).selected_stock ??
            (item as any).quantity ??
            (item as any).qty ??
            1;
          break;
        }
      }
    }

    const [pending_qty, setPendingQty] = useState<number | null>(null);

    // Smoothly clear pending_qty only after cart_quantity from useCart() catches up
    useEffect(() => {
      if (pending_qty !== null && cart_quantity === pending_qty) {
        setPendingQty(null);
      }
    }, [cart_quantity, pending_qty]);

    // Safety timeout to clear pending_qty if network hangs
    useEffect(() => {
      if (pending_qty === null) return;
      const timer = setTimeout(() => {
        setPendingQty(null);
      }, 3000);
      return () => clearTimeout(timer);
    }, [pending_qty]);

    const display_quantity = pending_qty ?? cart_quantity;

    const is_quantity_pending =
      add_to_cart_mutation.isPending ||
      increase_mutation.isPending ||
      decrease_mutation.isPending ||
      remove_mutation.isPending;

    const handleAddToCart = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const availability = await getProductAvailability(product_id, variant_id);
        if (availability && !availability.available_stock) {
          enqueueSnackbar("Product currently not available", {
            variant: "error",
          });
          return;
        }
      } catch {
        // Continue if availability check bypasses
      }

      setPendingQty(1);

      add_to_cart_mutation.mutate(
        {
          product_id,
          variant_id,
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
          },
          onError() {
            setPendingQty(null);
          },
        },
      );
    };

    const handleDecreaseQuantity = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const next_qty = Math.max(0, display_quantity - 1);
      setPendingQty(next_qty);

      if (cart_quantity > 1) {
        decrease_mutation.mutate(
          { variant_id },
          {
            onError() {
              setPendingQty(null);
            },
          },
        );
      } else {
        remove_mutation.mutate(
          { product_id, variant_id },
          {
            onError() {
              setPendingQty(null);
            },
          },
        );
      }
    };

    const handleIncreaseQuantity = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setPendingQty(display_quantity + 1);

      increase_mutation.mutate(
        { variant_id },
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
          },
          onError() {
            setPendingQty(null);
          },
        },
      );
    };

    if (display_quantity > 0) {
      return (
        <div
          className={clsx(
            "flex h-7 items-center justify-between rounded-lg bg-[#FF5300] px-1 text-white shadow-xs select-none sm:h-8",
            fullWidth ? "w-full px-3" : "w-[68px] sm:w-[74px]",
          )}
        >
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            className="flex size-5 cursor-pointer items-center justify-center rounded text-xs font-black text-white hover:bg-white/20 active:scale-90"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-4 text-center text-xs font-black text-white sm:text-sm">
            {display_quantity}
          </span>
          <button
            type="button"
            onClick={handleIncreaseQuantity}
            className="flex size-5 cursor-pointer items-center justify-center rounded text-xs font-black text-white hover:bg-white/20 active:scale-90"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={handleAddToCart}
        className={clsx(
          "flex h-7 items-center justify-center cursor-pointer rounded-lg border-[1.5px] border-[#FF5300] bg-white text-xs font-extrabold text-[#FF5300] shadow-2xs transition-all hover:bg-orange-50 active:scale-95 sm:h-8",
          fullWidth ? "w-full" : "w-[68px] sm:w-[74px]",
        )}
      >
        ADD
      </button>
    );
  },
);

QuantityControl.displayName = "QuantityControl";

const HomeProductCard: FC<IProps> = ({ product, className }) => {
  const {
    product_id,
    variant_id,
    title,
    media_url,
    selling_price: prop_selling_price,
    mrp: prop_mrp,
    discount_percentage: prop_discount,
    discount,
    weight,
    avg_rating: prop_avg_rating,
    rating: prop_rating,
    average_rating: prop_average_rating,
    rating_count: prop_rating_count,
    ratings_count: prop_ratings_count,
    reviews_count: prop_reviews_count,
    is_wishlisted: initial_wishlisted = false,
    sub_sub_category_id = 0,
  } = product;

  const avg_rating =
    prop_avg_rating ??
    prop_rating ??
    prop_average_rating ??
    (product as any).avg_rating ??
    (product as any).average_rating;

  const rating_count =
    prop_rating_count ??
    prop_ratings_count ??
    prop_reviews_count ??
    (product as any).reviews_count ??
    (product as any).ratings_count ??
    (product as any).rating_count ??
    (product as any).total_reviews;

  // Read exact selling price, MRP, and discount directly from API object fields
  // Note: API may return prices as strings, so we coerce everything to Number()
  const selling_price = Number(
    prop_selling_price ??
    (product as any).selling_price_with_commission ??
    (product as any).variant_pricing?.selling_price_with_commission ??
    (product as any).variant_pricing?.selling_price ??
    (product as any).variants?.[0]?.variant_pricing?.selling_price_with_commission ??
    (product as any).variants?.[0]?.variant_pricing?.selling_price ??
    (product as any).price ??
    0
  ) || 0;

  const raw_mrp = Number(
    prop_mrp ??
    (product as any).variant_pricing?.mrp ??
    (product as any).variants?.[0]?.variant_pricing?.mrp ??
    (product as any).variants?.[0]?.mrp ??
    (product as any).original_price ??
    0
  ) || 0;

  const raw_discount = Number(
    prop_discount ??
    discount ??
    ((product as any).discount_percentage != null
      ? (product as any).discount_percentage
      : raw_mrp > selling_price && raw_mrp > 0
        ? ((raw_mrp - selling_price) / raw_mrp) * 100
        : 0)
  ) || 0;

  const discount_perc = Math.round(raw_discount);

  const mrp = raw_mrp > selling_price ? raw_mrp : 0;

  const [is_wishlisted, setIsWishlisted] = useState(initial_wishlisted);

  const { data: user_details } = useUserDetails();
  const user_id = user_details?.id;

  const add_to_wishlist_mutation = useAddToWishlistMutation();
  const remove_from_wishlist_mutation = useRemoveFromWishlistMutation();

  const product_slug = generateSlug(title);
  const product_href = `/${product_slug}/p/${product_id}/${variant_id}`;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (is_wishlisted) {
      setIsWishlisted(false);
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
            setIsWishlisted(true);
          },
        },
      );
    } else {
      setIsWishlisted(true);
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
            setIsWishlisted(false);
          },
        },
      );
    }
  };

  return (
    <div
      className={clsx(
        "group relative flex h-full w-full flex-col justify-between rounded-2xl bg-[#FFF4EB] p-2 sm:p-2.5 transition-shadow hover:shadow-md border border-orange-100/60",
        className,
      )}
    >
      <div className="flex flex-1 flex-col justify-between">
        {/* Top Image Container & Text */}
        <Link
          href={product_href}
          title={`View ${title}`}
          className="block w-full"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white p-1.5 flex items-center justify-center">
            {/* Top-Left Discount Badge */}
            {discount_perc > 0 && (
              <span className="absolute top-0 left-0 z-10 rounded-tl-xl rounded-br-lg bg-[#FF5300] px-2 py-0.5 text-[9px] font-black text-white shadow-2xs tracking-tight uppercase sm:text-[10px]">
                {discount_perc}% OFF
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
              className="absolute top-1.5 right-1.5 z-10 flex size-7 sm:size-8 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-orange-500 shadow-2xs transition-transform hover:scale-105 active:scale-95"
            >
              <Heart
                className={clsx(
                  "size-3.5 sm:size-4 text-[#FF5300]",
                  is_wishlisted && "fill-[#FF5300]",
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
                className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Bottom-Left Rating Overlay */}
            <div className="absolute bottom-1.5 left-1.5 z-10 flex items-center gap-1 rounded-md bg-[#008748] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
              <span>
                {avg_rating != null && Number(avg_rating) > 0
                  ? Number(avg_rating).toFixed(1)
                  : "0.0"}
              </span>
              <Star className="size-2.5 fill-white text-white" />
              {rating_count != null && (
                <span className="text-[9px] font-semibold text-white/90 border-l border-white/30 pl-1">
                  {rating_count}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-2 line-clamp-2 min-h-[2.1rem] text-[11px] font-bold leading-snug text-gray-900 sm:text-xs">
            {title}
          </h3>

          {/* Weight / Unit */}
          {weight && (
            <p className="mt-0.5 text-[10px] font-medium text-gray-500 sm:text-[11px]">
              {weight}
            </p>
          )}
        </Link>
      </div>

      {/* Price and Action Row (Fixed at Bottom) */}
      <div className="mt-auto flex items-center justify-between gap-1 pt-2">
        {selling_price > 0 && (
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-gray-900 sm:text-base">
              ₹{selling_price}
            </span>
            {mrp > selling_price && (
              <span className="text-[10px] font-medium text-gray-400 line-through sm:text-xs">
                ₹{mrp}
              </span>
            )}
          </div>
        )}

        {/* Separated Quantity Controller Component */}
        <QuantityControl
          product_id={product_id}
          variant_id={variant_id}
          user_id={user_id}
          sub_sub_category_id={sub_sub_category_id}
          fullWidth={selling_price <= 0}
        />
      </div>
    </div>
  );
};

export default memo(HomeProductCard);
