import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";

// external component
import { Checkbox } from "@headlessui/react";

// local components
import QuantityStepper from "@/components/common/quantity-stepper.component";

// helpers
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  product: Omit<IProduct, "variants">;
  variant: IVariant;
  quantity: number;
  is_selected: boolean;
  selected_quantity: number;
  onToggle: () => void;
  onQuantityChange: (qty: number) => void;
};

const CancelOrderItem: FC<IProps> = ({
  product,
  variant,
  quantity,
  is_selected,
  selected_quantity,
  onToggle,
  onQuantityChange,
}) => {
  const { title } = product;
  const { variant_attribute_values, variant_pricing } = variant;

  const formated_variant_attribute_value = variant_attribute_values.map(
    ({ attribute, value }) => ({
      name: attribute.name,
      value:
        attribute.data_type === "enum"
          ? attribute.options?.find(
              ({ value: option_value }) => value == option_value,
            )?.label
          : value,
    }),
  );
  const variant_medias = variant.variant_medias.map(({ media }) => media);

  return (
    <div
      className={clsx(
        "rounded-xl border p-3 transition",
        is_selected ? "border-orange-500 bg-orange-50" : "border-gray-200",
      )}
    >
      <div className="flex items-start gap-3">
        {/* CHECKBOX */}
        <Checkbox
          checked={is_selected}
          onChange={onToggle}
          className={clsx(
            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
            is_selected
              ? "border-orange-500 bg-orange-500"
              : "border-gray-300 bg-white",
          )}
        >
          <svg
            className={clsx("h-3 w-3 text-white", !is_selected && "hidden")}
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M3 7.5L5.5 10L11 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Checkbox>

        {/* CONTENT */}
        <div className="flex flex-1 gap-4">
          {/* IMAGE */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-300 bg-gray-100">
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

          {/* INFO */}
          <div className="flex flex-1 flex-col space-y-1">
            {/* TITLE */}
            <h4 className="line-clamp-1 text-sm font-medium">{title}</h4>

            {!!formated_variant_attribute_value.length && (
              <p className="text-xs font-medium text-gray-600">
                {formated_variant_attribute_value
                  .map(({ name, value }) => `${name}: ${value}`)
                  .join(", ")}
              </p>
            )}

            {/* PRICE ROW */}
            <div className="text-sm text-gray-900">
              ₹{variant_pricing.selling_price_with_commission} ×{" "}
              {is_selected ? selected_quantity : quantity}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">Cancel quantity</p>
              <QuantityStepper
                size="small"
                show_decrease_disabled={!is_selected || selected_quantity <= 0}
                show_increase_disabled={
                  !is_selected || selected_quantity >= quantity
                }
                quantity={selected_quantity}
                onDecrease={() => {
                  onQuantityChange(selected_quantity - 1);
                }}
                onIncrease={() => {
                  onQuantityChange(selected_quantity + 1);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderItem;
