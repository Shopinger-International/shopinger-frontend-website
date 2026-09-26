import { useState, useEffect, memo } from "react";
import type { FC } from "react";

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
        <div className="flex h-7 sm:h-9 w-full items-center justify-between rounded-lg sm:rounded-xl bg-[#FF5300] px-2 text-white shadow-2xs select-none">
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            className="flex size-5 cursor-pointer items-center justify-center rounded text-xs font-black text-white hover:bg-white/20 active:scale-90"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-xs sm:text-sm font-black text-white">
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
        className="w-full rounded-lg bg-orange-500 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-orange-600 disabled:bg-orange-300 sm:rounded-xl sm:py-2.5 sm:text-sm cursor-pointer"
        aria-label="Add to cart"
        disabled={add_to_cart_mutation.isPending}
        onClick={handleAddToCart}
      >
        Add to cart
      </button>
    );
  },
);

ProductCardQuantityControl.displayName = "ProductCardQuantityControl";

export default ProductCardQuantityControl;
