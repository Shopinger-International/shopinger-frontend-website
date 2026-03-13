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
import MobileProductGallary from "@/components/product/product-gallary/mobile-product-gallary.component";

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
  const { title, brand, sub_sub_category } = product;
  const updated_title =
    !brand || brand.toLocaleLowerCase() == "generic" || title.includes(brand)
      ? title
      : `${brand} ${title}`;
  const { variant_pricing } = variant;
  const { mrp, selling_price_with_commission } = variant_pricing;
  const discount_percentage = Math.round(
    ((mrp - selling_price_with_commission) / mrp) * 100,
  );

  const nor_visual_variant_attributes = variant.variant_attribute_values
    .filter(
      ({ attribute }) =>
        !category_mappings.find(
          ({ attribute: mapping_attribute }) =>
            mapping_attribute.id == attribute.id,
        )?.is_visual,
    )
    .map(
      ({ value, attribute }) =>
        attribute.options?.find(
          ({ value: option_value }) => option_value == value,
        )?.label ?? value,
    );

  const visual_variant_attributes = variant.variant_attribute_values
    .filter(
      ({ attribute }) =>
        category_mappings.find(
          ({ attribute: mapping_attribute }) =>
            mapping_attribute.id == attribute.id,
        )?.is_visual,
    )
    .map(
      ({ value, attribute }) =>
        attribute.options?.find(
          ({ value: option_value }) => option_value == value,
        )?.label ?? value,
    );
  const heading = `${updated_title} ${!!nor_visual_variant_attributes.length ? "(" + nor_visual_variant_attributes.join(", ") + ")" : ""} ${!!visual_variant_attributes.length ? " - " + visual_variant_attributes.join(", ") : " "}`;
  return (
    <section aria-labelledby="product-title" className="flex flex-col lg:block">
      <div className="mb-4 hidden gap-2 lg:flex">
        {brand && <Badge className="bg-[#FFE2D0]">{brand}</Badge>}
        <Badge className="border border-neutral-300 bg-white">
          {sub_sub_category.name}
        </Badge>
      </div>
      <h1
        id="product-title"
        className="order-1 mb-2 text-sm font-semibold lg:mb-3 lg:text-xl lg:font-medium"
      >
        {heading}
      </h1>

      <MobileProductGallary
        variant={variant}
        media_group={media_group}
        product={product}
        category_mappings={category_mappings}
      />
      {/** MRP */}
      <section className="order-4 mb-4 flex flex-col">
        <h2 className="sr-only">Price</h2>
        <p>
          <span className="text-2xl lg:text-3xl">
            ₹{selling_price_with_commission}{" "}
          </span>
          {!!discount_percentage && (
            <>
              <span className="inline font-medium text-gray-600">
                {discount_percentage}% off
                <span className="sr-only">discount</span>
              </span>
            </>
          )}
        </p>
        <p>
          <span className="text-gray-600">M.R.P</span>{" "}
          <span className="line-through">₹{mrp}</span>
        </p>
        <p className="text-sm">Inclusive of all taxes</p>
      </section>

      {/** RATING */}
      <section className="order-5">
        <h2 className="sr-only">Product rating</h2>
        <p className="mb-4" aria-label="Product rating and reviews">
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
          <span className="inline">500+ bought in past month</span>
        </p>
      </section>

      <VariantSelection
        product={product}
        selected_attributes={selected_attributes}
        category_mappings={category_mappings}
        media_group={media_group}
      />
      <CheckDeliveryAvailability />
      <p className="order-6 mb-4 font-medium">
        Sold by{" "}
        <strong className="font-medium text-orange-500">Himang Retails</strong>
      </p>
      <ProductDetails product={product} category_mappings={category_mappings} />
      <div
        id="buy-cta-container"
        className="fixed bottom-0 left-0 z-4 flex w-full gap-3 border-t border-gray-300 bg-white px-4 py-3 shadow-md lg:sticky lg:border-none lg:px-0 lg:shadow-none"
      >
        <button className="w-full rounded-md border border-gray-300 bg-white py-2 font-semibold text-gray-900">
          Add to Cart
        </button>
        <button className="w-full rounded-md bg-orange-500 py-2 font-semibold text-white">
          Buy Now
        </button>
      </div>
    </section>
  );
};
export default ProductInfo;
