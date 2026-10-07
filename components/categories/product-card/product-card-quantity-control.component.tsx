import { useState, useEffect, memo } from "react";
import type { FC } from "react";
import { useRouter } from "next/router";
import { Plus, Minus } from "lucide-react";
import clsx from "clsx";

// const & analytics
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";
import addedToCartEvent from "@/analytics/events/added-to-cart.event";
import insightsClient from "@/lib/algolia/algolia-insight.lib";

// api hooks
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useCartItemIncreaseMutation from "@/hooks/axios/cart/use-cart-item-increase-mutation.hook";
import useCartItemDecreaseMutation from "@/hooks/axios/cart/use-cart-item-decrease-mutation.hook";
import useCartItemRemoveMutation from "@/hooks/axios/cart/use-cart-item-remove-mutation.hook";
import { getProductAvailability } from "@/hooks/axios/product/use-get-product-availbility.hook";
import { enqueueSnackbar } from "notistack";

export type IProductCardQuantityControlProps = {
  product_id: number;
  variant_id: number;
  user_id?: number;
  sub_sub_category_id?: number;
  selling_price: number;
  mrp: number;
  query_id?: string;
  index_name?: string;
  object_id?: string;
  fullWidth?: boolean;
};

const ProductCardQuantityControl: FC<IProductCardQuantityControlProps> = memo(
  ({
    product_id,
    variant_id,
    user_id,
    sub_sub_category_id = 0,
    selling_price,
    mrp,
    query_id,
    index_name,
    object_id,
    fullWidth = false,
  }) => {
    const router = useRouter();
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

    const { data: cart_data } = useCart();
    const add_to_cart_mutation = useAddToCartMutation();
    const increase_mutation = useCartItemIncreaseMutation();
    const decrease_mutation = useCartItemDecreaseMutation();
    const remove_mutation = useCartItemRemoveMutation();

    const [pending_qty, setPendingQty] = useState<number | null>(null);

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

    useEffect(() => {
      if (pending_qty !== null && cart_quantity === pending_qty) {
        setPendingQty(null);
      }
    }, [cart_quantity, pending_qty]);

    useEffect(() => {
      if (pending_qty === null) return;
      const timer = setTimeout(() => {
        setPendingQty(null);
      }, 3000);
      return () => clearTimeout(timer);
    }, [pending_qty]);

    const display_quantity = pending_qty ?? cart_quantity;

    const handleAddToCart = async (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const product_availability = await getProductAvailability(
        product_id,
        variant_id,
      );
      if (!product_availability.available_stock) {
        enqueueSnackbar("Product currently not available", {
          key: `product-availability-success-${Date.now()}`,
          variant: "error",
        });
        return;
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
            if (query_id && index_name && object_id) {
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
            }
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
            "flex h-7 sm:h-8 shrink-0 items-center justify-between rounded-lg bg-white select-none border-2",
            is_grocery
              ? "border-secondary text-secondary lg:border-brand lg:text-brand"
              : is_pharmacy
                ? "border-blue-500 text-blue-500 lg:border-brand lg:text-brand"
                : "border-brand text-brand",
            fullWidth ? "w-full px-3" : "w-full min-[230px]:w-20 px-1",
          )}
        >
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            className="flex size-5 sm:size-6 cursor-pointer items-center justify-center rounded hover:bg-black/5 active:scale-90"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3.5 sm:size-4" strokeWidth={2.5} />
          </button>
          <span className="w-4 text-center text-xs sm:text-sm font-black">
            {display_quantity}
          </span>
          <button
            type="button"
            onClick={handleIncreaseQuantity}
            className="flex size-5 sm:size-6 cursor-pointer items-center justify-center rounded hover:bg-black/5 active:scale-90"
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
        className={clsx(
          "flex h-7 sm:h-8 shrink-0 items-center justify-center cursor-pointer rounded-lg border-2 bg-white text-xs font-bold transition-all active:scale-95",
          is_grocery
            ? "border-secondary text-secondary hover:bg-green-50 lg:border-brand lg:text-brand lg:hover:bg-orange-50 disabled:bg-gray-100"
            : is_pharmacy
              ? "border-blue-500 text-blue-500 hover:bg-blue-50 lg:border-brand lg:text-brand lg:hover:bg-orange-50 disabled:bg-gray-100"
              : "border-brand text-brand hover:bg-orange-50 disabled:bg-gray-100",
          fullWidth ? "w-full" : "w-full min-[230px]:w-20",
        )}
        aria-label="Add to cart"
        disabled={add_to_cart_mutation.isPending}
        onClick={handleAddToCart}
      >
        ADD
      </button>
    );
  },
);

ProductCardQuantityControl.displayName = "ProductCardQuantityControl";

export default ProductCardQuantityControl;
