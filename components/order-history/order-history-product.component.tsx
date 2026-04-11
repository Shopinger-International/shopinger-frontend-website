import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// hooks
import useCategoryMappings from "@/hooks/axios/common/use-category-mappings.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  product: Omit<IProduct, "variants">;
  variant: IVariant;
  quantity: number;
};

const OrderHistoryProduct: FC<IProps> = ({ product, variant, quantity }) => {
  const {
    title,
    variant_visual_attribute_medias,
    id: product_id,
    sub_sub_category_id,
  } = product;
  const { data: category_mappings } = useCategoryMappings(sub_sub_category_id);
  const { id: variant_id, variant_attribute_values } = variant;
  const product_slug = generateSlug(title);

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
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-300 bg-gray-100 p-1">
        <Link href={`/${product_slug}/p/${product_id}/${variant_id}`}>
          <Image
            src={variant_medias[0]?.url ?? product.product_medias[0].media.url}
            alt={title}
            fill
            className="object-contain"
            sizes="80px"
          />
        </Link>
      </div>
      <div>
        <h4 className="line-clamp-1 text-sm font-medium">{title}</h4>
        <p className="mt-1 text-xs text-slate-600">Qty: {quantity}</p>
      </div>
    </div>
  );
};
export default OrderHistoryProduct;
