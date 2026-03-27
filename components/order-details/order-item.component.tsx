import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// hooks
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";
import useCategoryMappings from "@/hooks/axios/common/use-category-mappings.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  product: Omit<IProduct, "variants">;
  variant: IVariant & {
    selected_stock: number;
  };
};

const OrderItem: FC<IProps> = ({ product, variant }) => {
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
    <div className="rounded-xl border border-gray-300 bg-white p-4">
      <div className="flex gap-4">
        {/* IMAGE */}

        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-300 bg-gray-100">
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
        <div className="flex flex-1 flex-col justify-between space-y-1">
          {/* TOP */}
          <h4 className="line-clamp-1 text-sm font-medium">{title}</h4>

          {!!formated_variant_attribute_value.length && (
            <>
              <p className="text-xs font-medium text-gray-600">
                {formated_variant_attribute_value
                  .map(({ name, value }) => `${name}: ${value}`)
                  .join(", ")}
              </p>
            </>
          )}

          {/* PRICE ROW */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-900">
              ₹{variant_pricing.selling_price_with_commission} x{" "}
            </span>

            {variant.selected_stock}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderItem;
