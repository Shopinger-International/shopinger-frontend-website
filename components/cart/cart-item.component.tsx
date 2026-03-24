import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// local components
import QuantityStepper from "@/components/common/quantity-stepper.component";

// hooks
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";
import useCategoryMappings from "@/hooks/axios/common/use-category-mappings.hook";

// icons
import { X } from "lucide-react";

// helpers
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  product: Omit<IProduct, "variants">;
  variant: IVariant & {
    selected_stock: number;
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
  console.log("value of category mappings", category_mappings);
  const {
    variant_attribute_values,
    id: variant_id,
    selected_stock,
    variant_pricing,
  } = variant;
  const product_slug = generateSlug(title);
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

  let variant_medias = variant.variant_attribute_values
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

  return (
    <div className="border-b border-gray-300 p-6">
      <div className="flex gap-4">
        {/* IMAGE */}

        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-300 bg-gray-100">
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
          <div className="mt-3 flex items-center justify-between">
            {/* PRICE BLOCK */}
            <div className="flex flex-col">
              {/* PRICE ROW */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">
                  ₹
                  {variant_pricing.selling_price_with_commission *
                    selected_stock}
                </span>

                <span className="text-sm text-gray-600 line-through">
                  ₹{variant_pricing.mrp * selected_stock}
                </span>

                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                  20% OFF
                </span>
              </div>

              {/* STOCK */}
              <p className="mt-1 text-xs font-medium text-orange-500">
                Only 3 left
              </p>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              {/* Quantity Stepper */}
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

              {/* Remove Button */}
              <button className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-red-50 hover:text-red-600">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:hidden items-center gap-3 mt-4 justify-between flex">
        {/* Quantity Stepper */}
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

        {/* Remove Button */}
        <button className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-red-50 hover:text-red-600">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
export default CartItem;
