import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// icons
import { Star } from "lucide-react";

// local components
import Badge from "@/components/product/badge.component";
import IAttributeType from "@/types/attribute";
import VariantSelection from "@/components/product/variant-selection.component";
import MobileProductGallary from "@/components/product/product-gallary/mobile-product-gallary.component";

// helpers
import { generateSlug } from "@/helpers/product.helper";

// clsx
import clsx from "clsx";

type IProps = {
  product: IProduct;
  variant: IVariant;
  selected_attributes: Record<string, any>;
  media_group: IMediaGroup;
};

const MobileProductInfo: FC<IProps> = ({
  product,
  variant,
  selected_attributes,
  media_group,
}) => {
  const { title, brand, sub_sub_category } = product;
  const { variant_pricing } = variant;
  const { mrp, selling_price_with_commission } = variant_pricing;
  const discount_percentage = Math.round(
    ((mrp - selling_price_with_commission) / mrp) * 100,
  );

  const nor_visual_variant_attributes = variant.variant_attribute_values
    .filter(({ attribute }) => !attribute.is_visual)
    .map(
      ({ value, attribute }) =>
        attribute.options?.find(
          ({ value: option_value, label }) => option_value == value,
        )?.label ?? value,
    );

  const visual_variant_attributes = variant.variant_attribute_values
    .filter(({ attribute }) => attribute.is_visual)
    .map(
      ({ value, attribute }) =>
        attribute.options?.find(
          ({ value: option_value, label }) => option_value == value,
        )?.label ?? value,
    );
  const heading = `${brand ?? ""} ${title} ${!!nor_visual_variant_attributes.length ? "(" + nor_visual_variant_attributes.join(", ") + ")" : ""} ${!!visual_variant_attributes.length ? " - " + visual_variant_attributes.join(", ") : " "}`;

  type AttributeGroup = {
    attribute: IAttributeType;
    values: Set<any>;
  };

  const variant_attributes_values_group = product.variants
    .flatMap((v) => v.variant_attribute_values)
    .reduce<Record<string, AttributeGroup>>((acc, attribute_value) => {
      const { attribute, value } = attribute_value;

      if (!acc[attribute.code]) {
        acc[attribute.code] = {
          attribute,
          values: new Set(),
        };
      }

      acc[attribute.code].values.add(value);

      return acc;
    }, {});

  return (
    <div className="lg:hidden">
      <div className="space-y-3">
        <h1 className="text-sm font-semibold">{heading}</h1>
        <MobileProductGallary
          variant={variant}
          media_group={media_group}
          product={product}
        />
        <VariantSelection
          product={product}
          selected_attributes={selected_attributes}
          media_group={media_group}
        />
        <div className="mb-2.5 flex items-center gap-2.5 text-2xl">
          <span className="font-semibold">
            ₹{selling_price_with_commission}
          </span>
          <span className="text-xl line-through">₹{mrp}</span>
          {!!discount_percentage && (
            <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-medium text-white">
              {discount_percentage}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default MobileProductInfo;
