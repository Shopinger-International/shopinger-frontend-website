import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type { IStockStatus } from "@/types/cart";

// local components
import QuantityStepper from "@/components/common/quantity-stepper.component";

// hooks
import useCartItemIncreaseMutation from "@/hooks/axios/cart/use-cart-item-increase-mutation.hook";
import useCartItemDecreaseMutation from "@/hooks/axios/cart/use-cart-item-decrease-mutation.hook";
import useCartItemRemoveMutation from "@/hooks/axios/cart/use-cart-item-remove-mutation.hook";
import useCategoryMappings from "@/hooks/axios/common/use-category-mappings.hook";

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
};

const CartItem: FC<IProps> = ({ product, variant }) => {
  const {
    title,
    variant_visual_attribute_medias,
    id: product_id,
    sub_sub_category_id,
  } = product;
  const { data: category_mappings } = useCategoryMappings(sub_sub_category_id);
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

  const variant_medias = useMemo(() => {
    const media_group = variant_visual_attribute_medias.reduce<IMediaGroup>(
      (acc, item) => {
        const { attribute_id, attribute_value } = item;
        const updated_attribute_value = attribute_value.toLowerCase();

        if (!acc[attribute_id]) {
          acc[attribute_id] = {};
        }

        if (!acc[attribute_id][updated_attribute_value]) {
          acc[attribute_id][updated_attribute_value] = [];
        }

        acc[attribute_id][updated_attribute_value].push(item.media);

        return acc;
      },
      {},
    );

    let variant_medias = variant_attribute_values
      .filter(
        ({ attribute }) =>
          category_mappings?.find(
            ({ attribute: mapping_attribute }) =>
              mapping_attribute.id == attribute.id,
          )?.is_visual,
      )
      .flatMap(
        ({ attribute, value }) =>
          media_group[attribute.id as number]?.[value.toLowerCase()] ?? [],
      );

    return variant_medias;
  }, [
    variant_attribute_values.length,
    category_mappings?.length,
    variant_visual_attribute_medias.length,
  ]);

  return (
    <div
      className={clsx(
        "border-b border-gray-300 p-6",
        variant.stock_status === "STOCK_EXCEEDED" ? "bg-red-50" : "bg-white",
      )}
    >
      <div className="flex gap-4">
        {/* IMAGE */}

        <div
          className={clsx(
            "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-300 bg-gray-100",
            variant.stock_status == "STOCK_EXCEEDED" && "opacity-80",
          )}
        >
          <Link href={`/${product_slug}/p/${product_id}/${variant.id}`}>
            <Image
              src={
                variant_medias[0]?.url ?? product.product_medias[0].media.url
              }
              alt={title}
              fill
              className="object-contain"
              sizes="80px"
            />
          </Link>
        </div>

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
          <div className="mt-2 sm:mt-3 flex items-center justify-between">
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

                {discount_percentage && (
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
                  cart_item_decrease_mutation.mutate({
                    variant_id,
                  });
                }}
                onIncrease={() => {
                  cart_item_increase_mutation.mutate({
                    variant_id,
                  });
                }}
              />

              {/* Remove Button */}
              <button
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
                disabled={cart_item_remove_mutation.isPending}
                onClick={() =>
                  cart_item_remove_mutation.mutate({
                    variant_id,
                  })
                }
              >
                <X size={18} />
              </button>
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
            cart_item_decrease_mutation.mutate({
              variant_id,
            });
          }}
          onIncrease={() => {
            cart_item_increase_mutation.mutate({
              variant_id,
            });
          }}
        />

        {/* Remove Button */}
        <button
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
          disabled={cart_item_remove_mutation.isPending}
          onClick={() =>
            cart_item_remove_mutation.mutate({
              variant_id,
            })
          }
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
export default CartItem;
