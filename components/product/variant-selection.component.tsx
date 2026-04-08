import Image from "next/image";
import Link from "next/link";
// types
import type { FC } from "react";
import type IAttributeType from "@/types/attribute";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type IProduct from "@/types/product";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";

// helpers
import { generateSlug } from "@/helpers/product.helper";
import clsx from "clsx";
import { capitalizeValue } from "@/helpers/common.helper";

type AttributeGroup = {
  attribute: IAttributeType;
  values: Set<any>;
};

const VariantSelection: FC<{
  product: IProduct;
  selected_attributes: Record<string, any>;
  media_group: IMediaGroup;
  category_mappings: ICategoryAttributeMapping[];
}> = ({
  product: { id: product_id, title, variants, brand },
  selected_attributes,
  media_group,
  category_mappings,
}) => {
  const variant_attributes_values_group = variants
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
    <section className="order-3 mb-4 space-y-3" aria-label="Variant Selector">
      {Object.values(variant_attributes_values_group)
        .sort((a, b) => {
          // visual attributes first
          const mapping_a = category_mappings.find(
            ({ attribute }) => attribute.id == a.attribute.id,
          );
          const mapping_b = category_mappings.find(
            ({ attribute }) => attribute.id == b.attribute.id,
          );
          if (mapping_a?.is_visual == mapping_b?.is_visual) return 0;
          return mapping_a?.is_visual ? -1 : 1;
        })
        .map(({ attribute, values }) => (
          <div className="space-y-2" key={`variant-attribute-${attribute.id}`}>
            <h3 className="font-bold">
              {attribute.name} <span aria-hidden="true"> : </span>
              <span className="font-normal">
                {attribute.options?.find(
                  ({ value }) => value == selected_attributes[attribute.code],
                )?.label ?? selected_attributes[attribute.code]}
              </span>{" "}
            </h3>
            <div
              className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto py-2 pb-3 lg:flex-wrap lg:overflow-visible"
              role="radiogroup"
              aria-label={`Choose ${attribute.name}`}
            >
              {Array.from(values).map((value) => {
                const is_selected =
                  selected_attributes[attribute.code] === value;
                const variant_attributes = {
                  ...selected_attributes,
                  [attribute.code]: value,
                };
                const variant = variants.find(
                  ({ variant_attribute_values }) => {
                    return variant_attribute_values.every(
                      ({ attribute, value }) =>
                        variant_attributes[attribute.code] == value,
                    );
                  },
                );
                const readable_value =
                  attribute.options?.find(
                    ({ value: option_value }) => value == option_value,
                  )?.label ?? value;
                const aria_label = `${attribute.name} ${readable_value}. Price ${variant?.variant_pricing.selling_price_with_commission}. MRP ${variant?.variant_pricing.mrp}.`;
                const product_slug = generateSlug(title);
                if (!variant) {
                  return null;
                }

                return (
                  <Link
                    scroll={false}
                    href={`/${product_slug}/p/${product_id}/${variant?.id}`}
                    key={`variant-attribute-value-${value}`}
                    aria-current={is_selected ? "page" : undefined}
                    aria-checked={is_selected}
                    aria-label={aria_label}
                    role="radio"
                    className="shrink-0 snap-start"
                  >
                    {category_mappings.find(
                      ({ attribute: mapping_attribute }) =>
                        mapping_attribute.id == attribute.id,
                    )?.is_visual ? (
                      <div
                        className={clsx(
                          "group flex h-full w-24 flex-col overflow-hidden rounded-lg border bg-white transition-all duration-200 lg:w-20",
                          is_selected
                            ? "border-orange-500 ring-2 ring-orange-200"
                            : "border-gray-300 hover:border-orange-500",
                        )}
                      >
                        <div
                          className={clsx(
                            "relative h-24 w-full overflow-hidden border-b border-gray-300 group-hover:border-orange-500 lg:h-20",
                          )}
                        >
                          <Image
                            sizes="96px"
                            src={
                              media_group[attribute.id as number]?.[
                                value.toLowerCase()
                              ]?.[0].url
                            }
                            fill
                            alt={value}
                            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="w-full space-y-1 p-2 text-xs">
                          <p className="truncate font-medium text-neutral-800 lg:hidden">
                            {capitalizeValue(value)}
                          </p>

                          <p className="text-sm font-medium text-neutral-900">
                            ₹
                            {
                              variant?.variant_pricing
                                .selling_price_with_commission
                            }
                          </p>
                          {variant.variant_pricing.mrp !==
                            variant.variant_pricing
                              .selling_price_with_commission && (
                            <p className="text-xs text-gray-600 line-through">
                              ₹{variant?.variant_pricing.mrp}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span
                        className={clsx(
                          "shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-200",
                          is_selected
                            ? "border-orange-500 bg-orange-50 text-orange-600"
                            : "border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50",
                        )}
                      >
                        {attribute.options?.find(
                          ({ value: option_value }) => value == option_value,
                        )?.label ?? value}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
    </section>
  );
};

export default VariantSelection;
