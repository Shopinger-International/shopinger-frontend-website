import { useState } from "react";
// types
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
          !show_full_description &&
            "max-h-40 overflow-hidden text-sm lg:text-base",
        )}
      >
        {generateDescription(description)}

        {!show_full_description && (
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-linear-to-t from-white to-transparent" />
        )}
      </div>

      <button
        onClick={() => setShowFullDescription((prev) => !prev)}
        className="mt-2 text-sm font-medium text-orange-500 hover:underline lg:text-base"
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
  const {
    product_attribute_values,
    description,
    manufacturer_name,
    manufacturer_address,
    manufacturer_pincode,
    packer_name,
    packer_address,
    packer_pincode,
    importer_name,
    importer_address,
    importer_pincode,
  } = product;
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
  const tab_list = [
    ...Object.keys(grouped_by_display_area).map((item) =>
      item
        .split(" ")
        .map((val) => capitalizeValue(val))
        .join(" "),
    ),
    "Description",
    "Manufacturer Info",
  ];

  return (
    <TabGroup>
      <TabList className="no-scrollbar flex gap-2 overflow-x-auto">
        {tab_list.map((tab) => (
          <Tab
            key={tab}
            className={({ selected }) =>
              clsx(
                "shrink-0 rounded-md border border-gray-300 bg-gray-100 px-2 py-1.5 text-sm text-gray-600 focus:outline-none lg:text-base",
                selected && "bg-orange-500 text-white",
              )
            }
          >
            {tab}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="mt-4">
        {Object.keys(grouped_by_display_area).map((display_area) => (
          <TabPanel key={display_area} className="focus:outline-none">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {grouped_by_display_area[display_area].map(
                ({ attribute, value }) => (
                  <AttributeInfoCell
                    name={attribute.name}
                    value={getReadableValue({ attribute, value })}
                  />
                ),
              )}
            </div>
          </TabPanel>
        ))}
        <TabPanel className="focus:outline-none">
          <Description description={generateDescription(description)} />
        </TabPanel>
        <TabPanel className="focus:outline-none">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {[
              {
                label: "Manufacturer Name",
                value: manufacturer_name,
              },
              {
                label: "Manufacturer Address",
                value: manufacturer_address,
              },
              {
                label: "Manufacturer Pincode",
                value: manufacturer_pincode,
              },
              {
                label: "Packer Name",
                value: packer_name,
              },
              {
                label: "Packer Address",
                value: packer_address,
              },
              {
                label: "Packer Pincode",
                value: packer_pincode,
              },
              {
                label: "Importer Name",
                value: importer_name,
              },
              {
                label: "Importer Address",
                value: importer_address,
              },
              {
                label: "Importer Pincode",
                value: importer_pincode,
              },
            ].map(
              ({ label, value }) =>
                value && (
                  <AttributeInfoCell
                    name={label
                      .split("_")
                      .map((s) => capitalizeValue(s))
                      .join(" ")}
                    value={value}
                  />
                ),
            )}
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

export default ProductInfoTabs;
