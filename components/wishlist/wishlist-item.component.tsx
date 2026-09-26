import { useState, useEffect, memo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

// types
import type { IResponseType } from "@/hooks/axios/wishlist/use-get-wishlist.hook";
import type { FC } from "react";

// icons
import { Trash2, Plus, Minus } from "lucide-react";

// hooks
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";
import useCreateBuyingIntentMutation from "@/hooks/axios/checkout/use-create-buying-intent-mutation.hook";
import useRemoveFromWishlistMutation from "@/hooks/axios/wishlist/use-remove-from-wishlist-mutation.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import { useLoginModalContext } from "@/provider/login-modal-provider";
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useCartItemIncreaseMutation from "@/hooks/axios/cart/use-cart-item-increase-mutation.hook";
import useCartItemDecreaseMutation from "@/hooks/axios/cart/use-cart-item-decrease-mutation.hook";
import useCartItemRemoveMutation from "@/hooks/axios/cart/use-cart-item-remove-mutation.hook";

// analytics event
import addedToCartEvent from "@/analytics/events/added-to-cart.event";

// helpers
import { generateSlug } from "@/helpers/product.helper";
import { getProductAvailability } from "@/hooks/axios/product/use-get-product-availbility.hook";
import { enqueueSnackbar } from "notistack";

// const
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";

// analytics events
import removedFromWishlistEvent from "@/analytics/events/removed-from-wishlist.event";
import buyNowClickedEvent from "@/analytics/events/buy-now-clicked.event";

type IWishlistQuantityControlProps = {
  product_id: number;
  variant_id: number;
  user_id?: number;
  sub_sub_category_id?: number;
};

const WishlistQuantityControl: FC<IWishlistQuantityControlProps> = memo(
  ({ product_id, variant_id, user_id, sub_sub_category_id = 0 }) => {
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

    const [pending_qty, setPendingQty] = useState<number | null>(null);

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

    const handleAddToCart = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

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
              source: ANALYTICS_SOURCE_TYPE.WISHLIST,
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
              source: ANALYTICS_SOURCE_TYPE.WISHLIST,
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
        <div className="flex h-10 w-28 items-center justify-between rounded-md bg-brand px-2 text-white select-none sm:w-32">
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            className="flex size-8 cursor-pointer items-center justify-center rounded text-white hover:bg-white/20 active:scale-90"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" strokeWidth={2.5} />
          </button>
          <span className="text-sm font-black text-white">
            {display_quantity}
          </span>
          <button
            type="button"
            onClick={handleIncreaseQuantity}
            className="flex size-8 cursor-pointer items-center justify-center rounded text-white hover:bg-white/20 active:scale-90"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 disabled:bg-gray-300 sm:flex-none sm:px-6"
        disabled={add_to_cart_mutation.isPending}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    );
  },
);

WishlistQuantityControl.displayName = "WishlistQuantityControl";

const WishlistItem: FC<IResponseType["data"][number]> = ({
  product_id,
  variant_id,
  title,
  media_url,
  discount,
  mrp,
  selling_price,
  sub_sub_category_id,
}) => {
  const router = useRouter();
  const { data: user_details } = useUserDetails();
  const is_logged_in = !!user_details;
  const user_id = user_details?.id;
  const create_buying_intent_mutation = useCreateBuyingIntentMutation();
  const remove_from_wishlist_mutation = useRemoveFromWishlistMutation();
  const { openModal: openLoginModal } = useLoginModalContext();

  return (
    <article className="rounded-xl border border-gray-300 bg-white p-3 sm:flex sm:gap-4 sm:p-4">
      {/* Top */}
      <div className="flex gap-3">
        {/* Image */}
        <Link
          aria-label={`View ${title}`}
          href={`/${generateSlug(title)}/p/${product_id}/${variant_id}`}
        >
          <div className="relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 sm:size-28 sm:rounded-xl">
            <Image
              src={media_url}
              alt={title}
              fill={true}
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <Link
            aria-label={`View ${title}`}
            href={`/${generateSlug(title)}/p/${product_id}/${variant_id}`}
          >
            <h3 className="line-clamp-2 text-sm leading-5 font-medium text-gray-900 sm:text-base">
              {title}
            </h3>
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{selling_price.toLocaleString("en-IN")}
            </span>

            {mrp > selling_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}

            {Number(discount) > 0 && (
              <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
                {Math.round(Number(discount))}% OFF
              </span>
            )}
          </div>

          {mrp > selling_price && (
            <p className="mt-1 text-xs text-gray-500">
              You save{" "}
              <span className="font-semibold text-orange-600">
                ₹{(mrp - selling_price).toLocaleString("en-IN")}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex shrink-0 items-center gap-2 border-t border-gray-100 pt-4 sm:mt-auto sm:ml-auto sm:w-auto sm:border-0 sm:pt-0">
        <button
          type="button"
          aria-label="Remove from wishlist"
          title="Remove from wishlist"
          disabled={remove_from_wishlist_mutation.isPending}
          onClick={() =>
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
                    source: ANALYTICS_SOURCE_TYPE.WISHLIST,
                  });
                },
              },
            )
          }
          className="flex size-11 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-red-50 hover:text-red-600 disabled:text-red-300"
        >
          <Trash2 className="size-6" />
        </button>

        <WishlistQuantityControl
          product_id={product_id}
          variant_id={variant_id}
          user_id={user_id}
          sub_sub_category_id={sub_sub_category_id}
        />
        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:bg-orange-300 sm:flex-none sm:px-6"
          disabled={create_buying_intent_mutation.isPending}
          onClick={async () => {
            user_id &&
              buyNowClickedEvent({
                user_id,
                product_id,
                variant_id,
                category_id: sub_sub_category_id,
                category_type: "SUB_SUB",
                source: ANALYTICS_SOURCE_TYPE.WISHLIST,
              });
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
            if (is_logged_in) {
              create_buying_intent_mutation.mutate(
                {
                  product_id,
                  variant_id,
                  quantity: 1,
                },
                {
                  onSuccess({ intent_id }) {
                    router.push({
                      pathname: `/checkout/${intent_id}`,
                    });
                  },
                },
              );
            } else {
              openLoginModal({
                is_modal: true,
                title: "Log in to complete your purchase",
                onSuccess(user) {
                  if (user) {
                    create_buying_intent_mutation
                      .mutateAsync({
                        product_id,
                        variant_id,
                        quantity: 1,
                      })
                      .then((data) => {
                        const { intent_id } = data;
                        router.push(`/checkout/${intent_id}`);
                      });
                  }
                },
                onCancel() {},
              });
            }
          }}
        >
          Buy Now
        </button>
      </div>
    </article>
  );
};

export default WishlistItem;
