import Image from "next/image";
// types
import type { FC } from "react";
import type IVariant from "@/types/variant";

// local components
import QuantityStepper from "@/components/common/quantity-stepper.component";

// hooks
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";

type IProps = {
  title: string;
  main_image: string;
  product_id: number;
  variant: IVariant & {
    selected_stock: number;
  };
};

const CartItem: FC<IProps> = ({ title, main_image, product_id, variant }) => {
  const {
    variant_attribute_values,
    id: variant_id,
    selected_stock,
    variant_pricing,
  } = variant;
  const add_to_cart_mutation = useAddToCartMutation();
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
            ₹{variant_pricing.selling_price_with_commission}
          </span>

          <span className="text-xs text-gray-400 line-through sm:text-sm">
            ₹{variant_pricing.mrp}
          </span>

          <span className="text-xs font-medium text-green-600">20% OFF</span>
        </div>

        {/* Quantity + Remove */}
        <div className="flex items-center justify-between pt-1">
          <QuantityStepper
            quantity={selected_stock}
            onDecrease={() => {}}
            onIncrease={() => {
              add_to_cart_mutation.mutate({
                product_id,
                variant_id,
                quantity: 1,
              });
            }}
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
