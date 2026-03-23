import Image from "next/image";
// types
import type { FC } from "react";
import type { IVariantAttributeValues } from "@/types/variant";

// local components
import QuantityStepper from "@/components/common/quantity-stepper.component";

type IProps = {
  title: string;
  main_image: string;
  variant_attribute_values: IVariantAttributeValues[];
  selected_stock: number;
};

const CartItem: FC<IProps> = ({
  title,
  main_image,
  variant_attribute_values,
  selected_stock,
}) => {
  const formated_variant_attribute_value = variant_attribute_values.map(
    ({ attribute, value }) => {
      return {
        name: attribute.name,
        value:
          attribute.data_type === "enum"
            ? attribute.options?.find(
                ({ label, value: option_value }) => value == option_value,
              )?.label
            : value,
      };
    },
  );

  return (
    <div className="flex w-full gap-3 py-6 first:pt-0 last:pb-0 sm:gap-4">
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-2 sm:h-24 sm:w-24">
        <Image
          src={main_image}
          className="object-contain"
          alt={title}
          fill={true}
          sizes={"80px"}
        />
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
        {/* Title */}
        <h4 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
          {title}
        </h4>

        {/* Variant */}
        {!!formated_variant_attribute_value.length && (
          <p className="truncate text-xs text-gray-600">
            {formated_variant_attribute_value
              .map(({ name, value }) => `${name}: ${value}`)
              .join(", ")}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 sm:text-base">
            ₹799
          </span>

          <span className="text-xs text-gray-400 line-through sm:text-sm">
            ₹999
          </span>

          <span className="text-xs font-medium text-green-600">20% OFF</span>
        </div>

        {/* Quantity + Remove */}
        <div className="flex items-center justify-between pt-1">
          <QuantityStepper
            quantity={selected_stock}
            onDecrease={() => {}}
            onIncrease={() => {}}
          />

          <button className="text-xs font-medium text-gray-600 hover:text-red-500">
            Remove
          </button>
        </div>

        {/* Stock warning */}
        <p className="text-xs font-medium text-orange-600">
          Only 3 left in stock
        </p>
      </div>
    </div>
  );
};
export default CartItem;
