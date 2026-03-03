// types
import type { FC } from "react";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";

// local components
import VariantSelection from "@/components/product/variant-selection.component";
import MobileProductGallary from "@/components/product/product-gallary/mobile-product-gallary.component";
import CheckDeliveryAvailability from "@/components/product/product-info/check-delivery-availability.component";
import ProductDetails from "@/components/product/product-info/product-details.component";

type IProps = {
  product: IProduct;
  variant: IVariant;
  selected_attributes: Record<string, any>;
  media_group: IMediaGroup;
  category_mappings: ICategoryAttributeMapping[];
};

const MobileProductInfo: FC<IProps> = ({
  product,
  variant,
  selected_attributes,
  media_group,
  category_mappings,
}) => {
  const { title, brand } = product;
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
          ({ value: option_value }) => option_value == value,
        )?.label ?? value,
    );

  const visual_variant_attributes = variant.variant_attribute_values
    .filter(({ attribute }) => attribute.is_visual)
    .map(
      ({ value, attribute }) =>
        attribute.options?.find(
          ({ value: option_value }) => option_value == value,
        )?.label ?? value,
    );
  const heading = `${brand ?? ""} ${title} ${!!nor_visual_variant_attributes.length ? "(" + nor_visual_variant_attributes.join(", ") + ")" : ""} ${!!visual_variant_attributes.length ? " - " + visual_variant_attributes.join(", ") : " "}`;

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
        <CheckDeliveryAvailability />
        <ProductDetails
          product={product}
          category_mappings={category_mappings}
        />
      </div>
    </div>
  );
};
export default MobileProductInfo;
