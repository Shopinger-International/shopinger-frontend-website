import { useState, useEffect, memo } from "react";
import type { FC } from "react";
import { Plus, Minus } from "lucide-react";

// hooks
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useCartItemIncreaseMutation from "@/hooks/axios/cart/use-cart-item-increase-mutation.hook";
import useCartItemDecreaseMutation from "@/hooks/axios/cart/use-cart-item-decrease-mutation.hook";
import useCartItemRemoveMutation from "@/hooks/axios/cart/use-cart-item-remove-mutation.hook";

// helpers & analytics
import { getProductAvailability } from "@/hooks/axios/product/use-get-product-availbility.hook";
import { enqueueSnackbar } from "notistack";
import addedToCartEvent from "@/analytics/events/added-to-cart.event";
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";
import clsx from "clsx";

export interface IQuantityControlProps {
  product_id: number;
  variant_id: number;
  user_id?: number;
  sub_sub_category_id?: number;
  fullWidth?: boolean;
}

const HomeProductQuantityControl: FC<IQuantityControlProps> = memo(
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

HomeProductQuantityControl.displayName = "HomeProductQuantityControl";

export default HomeProductQuantityControl;
