import { useState, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

// icons
import { Heart, Star, Plus, Minus } from "lucide-react";

// types
import type { IProductRecommendation } from "@/hooks/axios/home/use-feed.hook";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";
import useAddToWishlistMutation from "@/hooks/axios/wishlist/use-add-to-wishlist-mutation.hook";
import useRemoveFromWishlistMutation from "@/hooks/axios/wishlist/use-remove-from-wishlist-mutation.hook";
import useIsWishlisted from "@/hooks/axios/wishlist/use-is-wishlisted";
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

interface IHomeProductCardProps {
  product: IHomeProduct;
  className?: string;
}

interface IQuantityControlProps {
  product_id: number;
  variant_id: number;
  user_id?: number;
  sub_sub_category_id?: number;
  fullWidth?: boolean;
}

// Helper functions for safe price and rating extraction from polymorphic API responses
function extractProductPrices(product: IHomeProduct) {
  const p = product as any;
  const selling_price =
    Number(
      product.selling_price ??
        p.selling_price_with_commission ??
        p.variant_pricing?.selling_price_with_commission ??
        p.variant_pricing?.selling_price ??
        p.variants?.[0]?.variant_pricing?.selling_price_with_commission ??
        p.variants?.[0]?.variant_pricing?.selling_price ??
        p.price ??
        0,
    ) || 0;

  const raw_mrp =
    Number(
      product.mrp ??
        p.variant_pricing?.mrp ??
        p.variants?.[0]?.variant_pricing?.mrp ??
        p.variants?.[0]?.mrp ??
        p.original_price ??
        0,
    ) || 0;

  const raw_discount =
    Number(
      product.discount_percentage ??
        product.discount ??
        (p.discount_percentage != null
          ? p.discount_percentage
          : raw_mrp > selling_price && raw_mrp > 0
            ? ((raw_mrp - selling_price) / raw_mrp) * 100
            : 0),
    ) || 0;

  const discount_perc = Math.round(raw_discount);
  const mrp = raw_mrp > selling_price ? raw_mrp : 0;

  return { selling_price, mrp, discount_perc };
}

function extractProductRating(product: IHomeProduct) {
  const p = product as any;
  const avg_rating =
    product.avg_rating ??
    product.rating ??
    product.average_rating ??
    p.avg_rating ??
    p.average_rating;

  const rating_count =
    product.rating_count ??
    product.ratings_count ??
    product.reviews_count ??
    p.reviews_count ??
    p.ratings_count ??
    p.rating_count ??
    p.total_reviews;

  return { avg_rating, rating_count };
}

// Quantity Controller Component
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
        if (Array.isArray(item.variants)) {
          const matched_variant = item.variants.find(
            (v: any) =>
              (v.id != null && Number(v.id) === Number(variant_id)) ||
              (v.variant_id != null &&
                Number(v.variant_id) === Number(variant_id)),
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

    // Smoothly clear pending_qty when cart_quantity catches up
    useEffect(() => {
      if (pending_qty !== null && cart_quantity === pending_qty) {
        setPendingQty(null);
      }
    }, [cart_quantity, pending_qty]);

    // Timeout safety for pending status
    useEffect(() => {
      if (pending_qty === null) return;
      const timer = setTimeout(() => {
        setPendingQty(null);
      }, 3000);
      return () => clearTimeout(timer);
    }, [pending_qty]);

    const display_quantity = pending_qty ?? cart_quantity;

    const handleAddToCart = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const availability = await getProductAvailability(
          product_id,
          variant_id,
        );
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
            "flex h-7 shrink-0 items-center justify-between rounded-lg bg-brand px-1 text-white select-none sm:h-8",
            fullWidth ? "w-full px-3" : "w-18 sm:w-20",
          )}
        >
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            className="flex size-5 sm:size-6 cursor-pointer items-center justify-center rounded text-white hover:bg-white/20 active:scale-90"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3.5 sm:size-4" strokeWidth={2.5} />
          </button>
          <span className="w-4 text-center text-xs font-black text-white sm:text-sm">
            {display_quantity}
          </span>
          <button
            type="button"
            onClick={handleIncreaseQuantity}
            className="flex size-5 sm:size-6 cursor-pointer items-center justify-center rounded text-white hover:bg-white/20 active:scale-90"
            aria-label="Increase quantity"
          >
            <Plus className="size-3.5 sm:size-4" strokeWidth={2.5} />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={handleAddToCart}
        className={clsx(
          "flex h-7 shrink-0 items-center justify-center cursor-pointer rounded-lg border-2 border-brand bg-white text-xs font-extrabold text-brand transition-all hover:bg-orange-50 active:scale-95 sm:h-8",
          fullWidth ? "w-full" : "w-18 sm:w-20",
        )}
      >
        ADD
      </button>
    );
  },
);

QuantityControl.displayName = "QuantityControl";

// Main Home Product Card Component
const HomeProductCard: FC<IHomeProductCardProps> = ({ product, className }) => {
  const {
    product_id,
    variant_id,
    title,
    media_url,
    weight,
    is_wishlisted: initial_wishlisted = false,
    sub_sub_category_id = 0,
  } = product;

  const { selling_price, mrp, discount_perc } = extractProductPrices(product);
  const { avg_rating, rating_count } = extractProductRating(product);

  const { data: wishlist_data } = useIsWishlisted({ variant_id });
  const [is_wishlisted, setIsWishlisted] = useState(initial_wishlisted);

  useEffect(() => {
    if (wishlist_data?.is_wishlisted !== undefined) {
      setIsWishlisted(wishlist_data.is_wishlisted);
    }
  }, [wishlist_data?.is_wishlisted]);

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
        "group relative flex h-full w-full flex-col justify-between rounded-2xl bg-card-warm p-2 sm:p-2.5 border border-orange-100/60",
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
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white p-1.5 flex items-center justify-center">
            {/* Top-Left Discount Badge */}
            {discount_perc > 0 && (
              <span className="absolute top-0 left-0 z-10 rounded-tl-xl rounded-br-lg bg-brand px-2 py-0.5 text-xs font-black text-white tracking-tight uppercase">
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
              className="absolute top-1.5 right-1.5 z-10 flex size-8 sm:size-9 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-orange-500 transition-transform active:scale-95"
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
                className="object-contain p-1 transition-transform duration-300"
              />
            </div>

            {/* Bottom-Left Rating Overlay */}
            <div className="absolute bottom-1.5 left-1.5 z-10 flex items-center gap-1 rounded-md bg-rating px-1.5 py-0.5 text-2xs font-bold text-white">
              <span>
                {avg_rating != null && Number(avg_rating) > 0
                  ? Number(avg_rating).toFixed(1)
                  : "0.0"}
              </span>
              <Star className="size-2.5 fill-white text-white" />
              {rating_count != null && (
                <span className="text-3xs font-semibold text-white/90 border-l border-white/30 pl-1">
                  {rating_count}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-2 line-clamp-2 min-h-8 text-2xs font-bold leading-snug text-gray-900 sm:text-xs">
            {title}
          </h3>

          {/* Weight / Unit */}
          {weight && (
            <p className="mt-0.5 text-2xs font-medium text-gray-500 sm:text-xs">
              {weight}
            </p>
          )}
        </Link>
      </div>

      {/* Price and Action Row (Fixed at Bottom) */}
      <div className="mt-auto flex items-center justify-between gap-1 pt-2">
        {selling_price > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-baseline min-w-0">
            <span className="text-xs font-black text-gray-900 sm:text-sm md:text-base leading-tight">
              ₹{selling_price}
            </span>
            {mrp > selling_price && (
              <span className="text-3xs font-medium text-gray-400 line-through leading-tight sm:text-2xs sm:ml-1">
                ₹{mrp}
              </span>
            )}
          </div>
        )}

        {/* Quantity Controller Component */}
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
