import Image from "next/image";
import Link from "next/link";
// types
import type { FC } from "react";
import type IAttributeType from "@/types/attribute";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type IProduct from "@/types/product";

// helpers
import { generateSlug } from "@/helpers/product.helper";
import clsx from "clsx";

type AttributeGroup = {
  attribute: IAttributeType;
  values: Set<any>;
};

const VariantSelection: FC<{
  product: IProduct;
  selected_attributes: Record<string, any>;
  media_group: IMediaGroup;
}> = ({
  product: { id: product_id, title, variants, brand },
  selected_attributes,
  media_group,
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
    <section className="mb-4 space-y-4" aria-label="Variant Selector">
      {Object.values(variant_attributes_values_group)
        .sort((a, b) => {
          // visual attributes first
          if (a.attribute.is_visual === b.attribute.is_visual) return 0;
          return a.attribute.is_visual ? -1 : 1;
        })
        .map(({ attribute: { is_visual, ...attribute }, values }) => (
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
              className="flex flex-wrap items-center gap-3"
              role="group"
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
                const product_slug = generateSlug(title);
                return (
                  <Link
                    href={`/${product_slug}/p/${product_id}/${variant?.id}`}
                    key={`variant-attribute-value-${value}`}
                    aria-current={is_selected ? "page" : undefined}
                  >
                    {is_visual ? (
                      <div
                        className={clsx(
                          "relative h-18 w-18 overflow-hidden rounded-lg border bg-white transition-all duration-200",
                          is_selected
                            ? "border-orange-500 ring-2 ring-orange-200"
                            : "border-neutral-300 hover:border-neutral-400",
                        )}
                      >
                        <Image
                          sizes={"90px"}
                          src={
                            media_group[attribute.id as number][
                              value.toLowerCase()
                            ][0].url
                          }
                          fill={true}
                          alt={value}
                        />
                      </div>
                    ) : (
                      <span
                        className={clsx(
                          "inline-block rounded-xl border px-3 py-2.5 font-semibold",
                          is_selected
                            ? "border-orange-500"
                            : "border-neutral-300",
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
