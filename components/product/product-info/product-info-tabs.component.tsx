import { useState } from "react";
// types
import type IAttributeType from "@/types/attribute";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";
import type { FC } from "react";
import type IProduct from "@/types/product";

// local components
import AttributeInfoCell from "@/components/product/product-info/attribute-info-cell.component";

// external component
import { Tab, TabGroup, TabPanels, TabPanel, TabList } from "@headlessui/react";

// helpers
import clsx from "clsx";
import { capitalizeValue } from "@/helpers/common.helper";
import { getReadableValue } from "@/components/product/product-info/product-details.component";
import { generateDescription } from "@/helpers/product.helper";

const Description: FC<{
  description: string;
}> = ({ description }) => {
  const [show_full_description, setShowFullDescription] = useState(false);
  return (
    <>
      <div
        className={clsx(
          "relative text-gray-600",
          !show_full_description && "max-h-40 overflow-hidden",
        )}
      >
        {generateDescription(description)}

        {!show_full_description && (
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-linear-to-t from-white to-transparent" />
        )}
      </div>

      <button
        onClick={() => setShowFullDescription((prev) => !prev)}
        className="mt-2 text-sm font-medium text-orange-500 hover:underline"
      >
        {show_full_description ? "See less" : "See more"}
      </button>
    </>
  );
};

const ProductInfoTabs: FC<{
  product: IProduct;
  category_mappings: ICategoryAttributeMapping[];
}> = ({ product, category_mappings }) => {
  const { product_attribute_values, description } = product;
  const mapped_by_attribute_id = new Map(
    category_mappings.map((mapping) => [
      mapping.attribute.id,
      mapping.display_area,
    ]),
  );
  const grouped_by_display_area = product_attribute_values.reduce(
    (acc, item) => {
      const displayArea = mapped_by_attribute_id.get(item.attribute.id);

      if (!displayArea) return acc;

      if (!acc[displayArea]) {
        acc[displayArea] = [];
      }

      acc[displayArea].push(item);

      return acc;
    },
    {} as Record<string, typeof product_attribute_values>,
  );
  console.log("value of grouped by display area", grouped_by_display_area);
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-md font-semibold text-gray-900">Product Details</h3>
        <p className="text-sm text-gray-600">
          {Object.keys(grouped_by_display_area)
            .map((display_area) => capitalizeValue(display_area))
            .join(", ")}
        </p>
      </div>
      <TabGroup>
        <TabList className="no-scrollbar flex gap-2 overflow-x-auto">
          {Object.keys(grouped_by_display_area).map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                clsx(
                  "shrink-0 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600 focus:outline-none",
                  selected && "bg-orange-500 text-white",
                )
              }
            >
              {tab
                .split(" ")
                .map((val) => capitalizeValue(val))
                .join(" ")}
            </Tab>
          ))}
          <Tab
            className={({ selected }) =>
              clsx(
                "shrink-0 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600 focus:outline-none",
                selected && "bg-orange-500 text-white",
              )
            }
          >
            Descriptions
          </Tab>
          <Tab
            className={({ selected }) =>
              clsx(
                "shrink-0 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600 focus:outline-none",
                selected && "bg-orange-500 text-white",
              )
            }
          >
            Manufacture Info
          </Tab>
        </TabList>
        <TabPanels className="mt-4">
          {Object.keys(grouped_by_display_area).map((display_area) => (
            <TabPanel key={display_area} className="text-sm focus:outline-none">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                {grouped_by_display_area[display_area].map(
                  ({ attribute, value }) => (
                    <AttributeInfoCell
                      name={attribute.name}
                      value={getReadableValue({ attribute, value })}
                      show_border={true}
                    />
                  ),
                )}
              </div>
            </TabPanel>
          ))}
          <TabPanel className="text-sm focus:outline-none">
            <Description description={generateDescription(description)} />
          </TabPanel>
          <TabPanel className="text-sm focus:outline-none">
            {description}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  );
};

export default ProductInfoTabs;
