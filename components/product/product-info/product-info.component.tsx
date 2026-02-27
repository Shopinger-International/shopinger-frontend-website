// types
import type { FC } from "react";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// icons
import { Star } from "lucide-react";

// local components
import Badge from "@/components/product/badge.component";
import VariantSelection from "@/components/product/variant-selection.component";

type IProps = {
  product: IProduct;
  variant: IVariant;
  selected_attributes: Record<string, any>;
  media_group: IMediaGroup;
};

const ProductInfo: FC<IProps> = ({
  product,
  variant,
  selected_attributes,
  media_group,
}) => {
  const { title, brand, sub_sub_category } = product;
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
    <div className="hidden lg:block">
      <div className="mb-8 flex gap-2">
        {brand && <Badge className="bg-[#FFE2D0]">{brand}</Badge>}
        <Badge className="border border-neutral-300 bg-white">
          {sub_sub_category.name}
        </Badge>
      </div>
      <h1 className="mb-3 text-xl font-medium">{heading}</h1>
      <div className="mb-1 flex flex-col text-3xl">
        <p>
          <span>₹{selling_price_with_commission}</span>
          {!!discount_percentage && (
            <span className="inline rounded-full px-2 py-1 text-sm font-medium">
              {discount_percentage}% off
            </span>
          )}
        </p>
        <p className="text-xs">
          <span className="text-gray-600">M.R.P</span>{" "}
          <span className="text-sm line-through">₹{mrp}</span>
        </p>
      </div>
      <p className="mb-2.5 text-sm">Inclusive of all taxes</p>
      <div className="mb-2.5 text-sm">
        <span className="font-medium">
          4.6 <Star className="inline size-4 fill-amber-300 text-amber-300" />
        </span>{" "}
        | <span className="text-orange-500">2,847 reviews</span>{" "}
        <span className="">500+ bought in past month</span>
      </div>
      <VariantSelection
        product={product}
        selected_attributes={selected_attributes}
        media_group={media_group}
      />
      <div className="inline-flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">Check delivery services</h4>
          <input
            className="rounded-md border border-orange-500 px-4 py-2 text-xs font-medium"
            placeholder="Enter pincode"
          />
          <button className="text-sm font-medium text-orange-500">
            Change
          </button>
        </div>
        <span className="text-sm font-medium text-gray-500">
          Deliver by Tomorrow 11pm
        </span>
      </div>
      <div>
      </div>
    </div>
  );
};
export default ProductInfo;
