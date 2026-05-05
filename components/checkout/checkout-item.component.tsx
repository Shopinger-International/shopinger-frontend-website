import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";
import type { IStockStatus } from "@/types/cart";

// local components
import QuantityStepper from "@/components/common/quantity-stepper.component";

// hooks
import useCartItemIncreaseMutation from "@/hooks/axios/cart/use-cart-item-increase-mutation.hook";
import useCartItemDecreaseMutation from "@/hooks/axios/cart/use-cart-item-decrease-mutation.hook";
import useCartItemRemoveMutation from "@/hooks/axios/cart/use-cart-item-remove-mutation.hook";
import useUpdateIntentQuantityMutation from "@/hooks/axios/checkout/use-update-intent-quantity-mutation.hook";

// icons
import { X } from "lucide-react";

// helpers
import { generateSlug } from "@/helpers/product.helper";
import clsx from "clsx";

const getStockAvailabilityText = (stock_status: IStockStatus) => {
  switch (stock_status) {
    case "AVAILABLE":
      return "In Stock";
    case "OUT_OF_STOCK":
      return "Out of stock";
    case "STOCK_EXCEEDED":
      return "Only limited stock available. Please reduce quantity.";
  }
};

type IProps = {
  product: Omit<IProduct, "variants">;
  variant: IVariant & {
    selected_stock: number;
    stock_status: IStockStatus;
  };
  type: "buy-checkout" | "cart-checkout";
  intent_id?: string;
};

const CheckoutItem: FC<IProps> = ({ product, variant, type, intent_id }) => {
  const { title, id: product_id } = product;
  const {
    variant_attribute_values,
    id: variant_id,
    selected_stock,
    variant_pricing,
  } = variant;
  const product_slug = generateSlug(title);
  const cart_item_increase_mutation = useCartItemIncreaseMutation();
  const cart_item_decrease_mutation = useCartItemDecreaseMutation();
  const cart_item_remove_mutation = useCartItemRemoveMutation();
  const update_intent_quantity_mutation = useUpdateIntentQuantityMutation();
  const formated_variant_attribute_value = variant_attribute_values.map(
    ({ attribute, value }) => {
      return {
        name: attribute.name,
        value:
          attribute.data_type === "enum"
            ? attribute.options?.find(
                ({ value: option_value }) => value == option_value,
              )?.label
            : value,
      };
    },
  );

  const { mrp, selling_price_with_commission } = variant_pricing;
  const discount_percentage = Math.round(
    ((mrp - selling_price_with_commission) / mrp) * 100,
  );
  const variant_medias = variant.variant_medias.map(({ media }) => media);

  return (
    <div
      className={clsx(
        "border-b border-gray-300 p-6",
        variant.stock_status === "STOCK_EXCEEDED" ? "bg-red-50" : "bg-white",
      )}
    >
      <div className="flex gap-4">
        {/* IMAGE */}

        <Link href={`/${product_slug}/p/${product_id}/${variant.id}`}>
          <div
            className={clsx(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-300 bg-gray-100",
              variant.stock_status == "STOCK_EXCEEDED" && "opacity-80",
            )}
          >
            <Image
              src={
                variant_medias[0]?.url ?? product.product_medias[0].media.url
              }
              alt={title}
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
        </Link>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col justify-between">
          {/* TOP */}
          <h4 className="line-clamp-2 text-sm font-semibold">{title}</h4>

          {!!formated_variant_attribute_value.length && (
            <>
              <p className="mt-1 text-xs font-medium text-gray-600">
                {formated_variant_attribute_value
                  .map(({ name, value }) => `${name}: ${value}`)
                  .join(", ")}
              </p>
            </>
          )}

          {/* BOTTOM */}
          <div className="mt-2 flex items-center justify-between sm:mt-3">
            {/* PRICE BLOCK */}
            <div className="flex flex-col">
              {/* PRICE ROW */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 sm:text-lg">
                  ₹{selling_price_with_commission * selected_stock}
                </span>

                <span className="text-sm text-gray-600 line-through">
                  ₹{mrp * selected_stock}
                </span>

                {!!discount_percentage && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                    {discount_percentage}% OFF
                  </span>
                )}
              </div>

              {/* STOCK */}
              <p
                className={clsx(
                  "mt-1 text-xs",
                  variant.stock_status == "STOCK_EXCEEDED"
                    ? "font-semibold text-red-600"
                    : "font-medium text-orange-500",
                )}
              >
                {getStockAvailabilityText(variant.stock_status)}
              </p>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              {/* Quantity Stepper */}
              <QuantityStepper
                quantity={selected_stock}
                show_increase_disabled={
                  cart_item_increase_mutation.isPending ||
                  variant.stock_status === "STOCK_EXCEEDED"
                }
                show_decrease_disabled={cart_item_decrease_mutation.isPending}
                onDecrease={() => {
                  if (type == "cart-checkout") {
                    cart_item_decrease_mutation.mutate({
                      variant_id,
                    });
                  } else {
                    update_intent_quantity_mutation.mutate({
                      intent_id: intent_id as string,
                      variant_id,
                      quantity: selected_stock - 1,
                    });
                  }
                }}
                onIncrease={() => {
                  if (type == "cart-checkout") {
                    cart_item_increase_mutation.mutate({
                      variant_id,
                    });
                  } else {
                    update_intent_quantity_mutation.mutate({
                      intent_id: intent_id as string,
                      variant_id,
                      quantity: selected_stock + 1,
                    });
                  }
                }}
              />

              {/* Remove Button */}
              {type == "cart-checkout" && (
                <button
                  className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
                  disabled={cart_item_remove_mutation.isPending}
                  onClick={() =>
                    cart_item_remove_mutation.mutate({
                      variant_id,
                    })
                  }
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
        {/* Quantity Stepper */}
        <QuantityStepper
          show_increase_disabled={
            cart_item_increase_mutation.isPending ||
            variant.stock_status === "STOCK_EXCEEDED"
          }
          show_decrease_disabled={cart_item_decrease_mutation.isPending}
          quantity={selected_stock}
          onDecrease={() => {
            if (type == "cart-checkout") {
              cart_item_decrease_mutation.mutate({
                variant_id,
              });
            } else {
              update_intent_quantity_mutation.mutate({
                intent_id: intent_id as string,
                variant_id,
                quantity: selected_stock - 1,
              });
            }
          }}
          onIncrease={() => {
            if (type == "cart-checkout") {
              cart_item_increase_mutation.mutate({
                variant_id,
              });
            } else {
              update_intent_quantity_mutation.mutate({
                intent_id: intent_id as string,
                variant_id,
                quantity: selected_stock + 1,
              });
            }
          }}
        />

        {/* Remove Button */}
        {type == "cart-checkout" && (
          <button
            className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
            disabled={cart_item_remove_mutation.isPending}
            onClick={() =>
              cart_item_remove_mutation.mutate({
                variant_id,
              })
            }
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
export default CheckoutItem;
