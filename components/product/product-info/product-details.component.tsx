import { useState, useEffect } from "react";
// types
import type { FC, ReactNode } from "react";
import type IAttributeType from "@/types/attribute";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";
import IProduct from "@/types/product";

// local components
import ProductInfoTabs from "@/components/product/product-info/product-info-tabs.component";
import AttributeInfoCell from "@/components/product/product-info/attribute-info-cell.component";

// external components
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

// helpers
import { capitalizeValue } from "@/helpers/common.helper";
import clsx from "clsx";

// const
import { DISPLAY_AREA } from "@/constants/display-area.constant";

// icons
import { ChevronUpIcon } from "lucide-react";

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
  category_mappings: ICategoryAttributeMapping[];
}> = ({ product, category_mappings }) => {
  const { key_features, brand, country_of_origin, product_attribute_values } =
    product;
  let updated_key_features = (JSON.parse(key_features) ?? []) as Array<string>;
  const [show_all, setShowAll] = useState(false);
  const initial_visible = 4;

  const display_features = show_all
    ? updated_key_features
    : updated_key_features.slice(0, initial_visible);

  // top highlights
  const top_highlights_attribute_id = category_mappings
    .filter((mapping) =>
      mapping.display_area.includes(DISPLAY_AREA.TOP_HIGHLIGHTS),
    )
    .map((mapping) => mapping.attribute.id);

  const top_highlights = [
    ...product_attribute_values.filter(({ attribute }) =>
      top_highlights_attribute_id.includes(attribute.id),
    ),
  ];
  const full_top_highlights = [
    ...(brand ? [{ name: "Brand", value: brand }] : []),
    ...top_highlights.map(({ attribute, value }) => ({
      name: attribute.name,
      value: getReadableValue({ attribute, value }),
    })),
    ...(country_of_origin
      ? [{ name: "Country of origin", value: country_of_origin }]
      : []),
  ];

  useEffect(() => {
    const buy_cta_container = document.getElementById("buy-cta-container");
    if (!buy_cta_container) return;

    const setHeight = () => {
      document.documentElement.style.setProperty(
        "--buy-cta-container-height",
        `${buy_cta_container.offsetHeight}px`,
      );
    };

    setHeight();

    const observer = new ResizeObserver(setHeight);
    observer.observe(buy_cta_container);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="order-8 flex h-full flex-col">
      <div className="flex-1">
        {!!full_top_highlights.length && (
          <ExtendedDisclosure default_open={true} heading="Top Highlights">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
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
          </ExtendedDisclosure>
        )}

        {!!updated_key_features.length && (
          <ExtendedDisclosure default_open={true} heading="About this item">
            <div aria-live="polite" className="sr-only">
              {show_all
                ? `Showing all ${updated_key_features.length} features`
                : `Showing first ${initial_visible} features`}
            </div>
            <div id="key-features-content">
              <ul className="list-outside list-disc space-y-1.5 pl-5 text-sm text-gray-600 lg:text-base">
                {display_features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            {updated_key_features.length > initial_visible && (
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
          </ExtendedDisclosure>
        )}

        <ExtendedDisclosure default_open={false} heading="All Details">
          <ProductInfoTabs
            product={product}
            category_mappings={category_mappings}
          />
        </ExtendedDisclosure>
      </div>
    </section>
  );
};

export default ProductDetails;

const ExtendedDisclosure: FC<{
  children: ReactNode;
  heading: string;
  default_open: boolean;
}> = ({ children, heading, default_open }) => {
  return (
    <Disclosure defaultOpen={default_open}>
      {({ open }) => (
        <div className="m-0 border-b border-gray-200 last:border-none">
          <h2>
            <DisclosureButton
              className={clsx(
                "group flex w-full items-center justify-between py-3 text-left text-base font-semibold text-gray-900 transition-colors hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
                open ? "lg:pt-4 lg:pb-3" : "lg:py-4",
              )}
            >
              <span>{heading}</span>

              <span
                className="flex items-center justify-center rounded-lg bg-gray-100 p-1 transition-colors group-hover:bg-gray-200"
                aria-hidden={true}
              >
                <ChevronUpIcon
                  aria-hidden={true}
                  className={clsx(
                    "size-5 text-gray-500 transition-transform duration-200 ease-in-out",
                    open && "rotate-180",
                  )}
                />
              </span>
            </DisclosureButton>
          </h2>

          <DisclosurePanel className="overflow-hidden pb-4 text-gray-600">
            {children}
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};
