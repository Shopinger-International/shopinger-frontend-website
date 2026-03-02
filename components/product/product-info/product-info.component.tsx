// types
import type { FC } from "react";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";

// icons
import { Star } from "lucide-react";

// local components
import Badge from "@/components/product/badge.component";
import VariantSelection from "@/components/product/variant-selection.component";
import CheckDeliveryAvailability from "@/components/product/product-info/check-delivery-availability.component";
import ProductDetails from "@/components/product/product-info/product-details.component";

// helpers
import { generateDescription } from "@/helpers/product.helper";

type IProps = {
  product: IProduct;
  variant: IVariant;
  selected_attributes: Record<string, any>;
  media_group: IMediaGroup;
  category_mappings: ICategoryAttributeMapping[];
};

const ProductInfo: FC<IProps> = ({
  product,
  variant,
  selected_attributes,
  media_group,
  category_mappings,
}) => {
  const {
    title,
    brand,
    sub_sub_category,
    key_features,
    product_attribute_values,
  } = product;
  const updated_title =
    !brand || title.includes(brand) ? title : `${brand} ${title}`;
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
  const heading = `${updated_title} ${!!nor_visual_variant_attributes.length ? "(" + nor_visual_variant_attributes.join(", ") + ")" : ""} ${!!visual_variant_attributes.length ? " - " + visual_variant_attributes.join(", ") : " "}`;
  return (
    <section aria-labelledby="product-title" className="hidden lg:block">
      <div className="mb-4 flex gap-2">
        {brand && <Badge className="bg-[#FFE2D0]">{brand}</Badge>}
        <Badge className="border border-neutral-300 bg-white">
          {sub_sub_category.name}
        </Badge>
      </div>
      <h1 id="product-title" className="mb-3 text-xl font-medium">
        {heading}
      </h1>
      {/** MRP */}
      <section className="mb-4 flex flex-col text-3xl">
        <p>
          <span>₹{selling_price_with_commission} </span>
          {!!discount_percentage && (
            <span className="inline text-base font-medium text-gray-600">
              {discount_percentage}% off
            </span>
          )}
        </p>
        <p className="text-xs">
          <span className="text-gray-600">M.R.P</span>{" "}
          <span className="text-sm line-through">₹{mrp}</span>
        </p>
        <p className="text-sm">Inclusive of all taxes</p>
      </section>

      {/** RATING */}
      <p className="mb-4 text-sm" aria-label="Product rating and reviews">
        <strong className="font-medium">4.6 </strong>{" "}
        <span className="sr-only">out of 5 stars</span>{" "}
        <Star
          className="inline size-4 fill-amber-300 text-amber-300"
          aria-hidden="true"
        />
        <span aria-hidden="true"> | </span>{" "}
        <a
          href="#reviews"
          className="text-orange-500"
          aria-label={`view all ${2847} reviews`}
        >
          2,847 reviews
        </a>{" "}
        <span className="inline text-sm">500+ bought in past month</span>
      </p>
      <VariantSelection
        product={product}
        selected_attributes={selected_attributes}
        media_group={media_group}
      />
      <CheckDeliveryAvailability />
      <p className="mb-4 text-sm font-medium">
        Sold by{" "}
        <strong className="font-medium text-orange-500">Himang Retails</strong>
      </p>
      <ProductDetails
        product={product}
        category_mappings={category_mappings}
      />
    </section>
  );
};
export default ProductInfo;
