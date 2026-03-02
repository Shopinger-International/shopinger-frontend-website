import { useState } from "react";
// types
import type { FC } from "react";
import type IAttributeType from "@/types/attribute";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";
import IProduct from "@/types/product";

// local components
import ProductInfoTabs from "@/components/product/product-info/product-info-tabs.component";
import AttributeInfoCell from "@/components/product/product-info/attribute-info-cell.component";

// helpers
import { capitalizeValue } from "@/helpers/common.helper";

// const
import { DISPLAY_AREA } from "@/constants/display-area.constant";

export const getReadableValue = ({
  attribute,
  value,
}: {
  attribute: IAttributeType;
  value: any;
}) => {
  if (!value) return "";

  if (attribute.data_type === "enum") {
    if (attribute.input_type === "multi_select") {
      if (typeof value !== "string") return "";

      return value
        .split(",")
        .map(
          (val: string) =>
            attribute.options?.find(
              ({ value: optionValue }) => val === optionValue,
            )?.label ?? capitalizeValue(val),
        )
        .join(", ");
    }

    return (
      attribute.options?.find(({ value: optionValue }) => optionValue === value)
        ?.label ?? capitalizeValue(String(value))
    );
  }

  return capitalizeValue(String(value));
};

const ProductDetails: FC<{
  product: IProduct;
  initial_visible?: number;
  category_mappings: ICategoryAttributeMapping[];
}> = ({ product, initial_visible = 4, category_mappings }) => {
  const { key_features, brand, country_of_origin, product_attribute_values } =
    product;
  let updated_key_features = JSON.parse(key_features) as Array<string>;
  const [show_all, setShowAll] = useState(false);

  const display_features = show_all
    ? updated_key_features
    : updated_key_features.slice(0, initial_visible);

  // top highlights
  const top_highlights_attribute_id = category_mappings
    .filter((mapping) => mapping.display_area === DISPLAY_AREA.TOP_HIGHLIGHTS)
    .map((mapping) => mapping.attribute.id);

  const top_highlights = [
    ...product_attribute_values.filter(({ attribute }) =>
      top_highlights_attribute_id.includes(attribute.id),
    ),
  ];
  const full_top_highlights = [
    { name: "Brand", value: brand },
    ...top_highlights.map(({ attribute, value }) => ({
      name: attribute.name,
      value: getReadableValue({ attribute, value }),
    })),
    { name: "Country of origin", value: country_of_origin },
  ];
  console.log("value of data", full_top_highlights);

  return (
    <>
      <section className="mb-4" aria-labelledby="highlights">
        <h3
          className="text-md mb-4 font-semibold text-gray-900"
          id="highlights"
        >
          Top Highlights
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-300">
          {full_top_highlights.map((item, index) => {
            const is_in_last_row = index >= full_top_highlights.length - 2;

            return (
              <AttributeInfoCell
                key={index}
                name={item.name}
                value={item.value}
                show_border={!is_in_last_row}
              />
            );
          })}
        </div>
      </section>
      <section className="mb-4 space-y-2" aria-labelledby="about-item">
        <h3
          className="text-md mb-4 font-semibold text-gray-900"
          id="about-item"
        >
          About this item
        </h3>
        <div id="key-features-content">
          <ul className="list-outside list-disc space-y-1.5 pl-5 text-gray-600">
            {display_features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        {key_features.length > initial_visible && (
          <button
            onClick={() => setShowAll(!show_all)}
            className="mt-1 font-medium text-orange-500 hover:underline"
            aria-expanded={show_all}
            aria-controls="key-features-content"
          >
            {show_all
              ? "See less"
              : `See more (${updated_key_features.length - initial_visible})`}
          </button>
        )}
      </section>
      <ProductInfoTabs
        product={product}
        category_mappings={category_mappings}
      />
    </>
  );
};

export default ProductDetails;
