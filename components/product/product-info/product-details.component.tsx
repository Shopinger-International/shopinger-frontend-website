import Link from "next/link";
import { useState, useEffect } from "react";
// types
import type { FC, ReactNode } from "react";
import type IAttributeType from "@/types/attribute";
import type IProduct from "@/types/product";
import type { ILoginModalState } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type { IReportModalState } from "@/pages/[product_slug]/p/[product_id]/reviews";
import type IReview from "@/types/review";
import type { IFormattedCategoryMapping } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// local components
import ProductInfoTabs from "@/components/product/product-info/product-info-tabs.component";
import AttributeInfoCell from "@/components/product/product-info/attribute-info-cell.component";

// api hooks
import useProductReviews from "@/hooks/axios/review/use-product-reviews.hook";

const ProductReview = dynamic(
  () =>
    import("@/components/product/product-info/review/product-review.component"),
  {
    ssr: false,
  },
);

import ReviewGallary from "@/components/product/product-info/review/review-gallary.component";

// external components
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

// helpers
import clsx from "clsx";
import { capitalizeFirstLetter } from "@/helpers/common.helper";
import { generateSlug } from "@/helpers/product.helper";

// const
import { DISPLAY_AREA } from "@/constants/display-area.constant";

// icons
import { ChevronUpIcon } from "lucide-react";
import dynamic from "next/dynamic";

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
            )?.label ?? capitalizeFirstLetter(val),
        )
        .join(", ");
    }

    return (
      attribute.options?.find(({ value: optionValue }) => optionValue === value)
        ?.label ?? capitalizeFirstLetter(String(value))
    );
  }

  return String(value);
};

export const DIMENSION_ATTR = {
  ITEM_LENGTH: "item_length",
  ITEM_WIDTH: "item_width",
  ITEM_HEIGHT: "item_height",
};

type IProps = {
  product: IProduct;
  category_mappings: Array<IFormattedCategoryMapping>;
  handleLoginModalState: ({
    open,
    action_type,
    onSuccess,
  }: ILoginModalState) => void;
  handleReportModalState: ({ open, review_id }: IReportModalState) => void;
};

const ProductDetails: FC<IProps> = ({
  product,
  category_mappings,
  handleLoginModalState,
  handleReportModalState,
}) => {
  const review_exist = !!product.reviews_count;
  const { key_features, brand, country_of_origin, product_attribute_values } =
    product;
  const { data } = useProductReviews({
    productId: product.id,
    sort: "helpful",
  });

  const rating_summary = data?.pages[0].summary;
  const product_reviews = data?.pages.reduce<IReview[]>((acc, { reviews }) => {
    return [...acc, ...reviews];
  }, []);

  const top_medias = rating_summary?.top_media ?? [];
  const product_slug = generateSlug(product.title);
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
    .map((mapping) => mapping.attribute_id);

  let top_highlights = [
    ...product_attribute_values.filter(({ attribute }) =>
      top_highlights_attribute_id.includes(attribute.id),
    ),
  ];

  const dimension_attr_code = [
    DIMENSION_ATTR.ITEM_LENGTH,
    DIMENSION_ATTR.ITEM_WIDTH,
    DIMENSION_ATTR.ITEM_HEIGHT,
  ];
  const product_dimension_attr = top_highlights.filter(({ attribute }) =>
    dimension_attr_code.includes(attribute.code),
  );

  top_highlights = top_highlights.filter(
    ({ attribute, value }) =>
      !dimension_attr_code.includes(attribute.code) &&
      value !== null &&
      value !== undefined &&
      value !== "",
  );
  const full_top_highlights = [
    ...(brand ? [{ name: "Brand", value: brand, unit: null }] : []),
    ...top_highlights.map(({ attribute, value }) => ({
      name: attribute.name,
      value: getReadableValue({ attribute, value }),
      unit: attribute.is_unit
        ? category_mappings.find(
            (mapping) => mapping.attribute_code == attribute.code,
          )?.unit_code
        : null,
    })),
    ...(dimension_attr_code.every((code) =>
      product_dimension_attr.some(({ attribute }) => attribute.code == code),
    )
      ? [
          {
            name: "Product Dimensions (L x W x H)",
            value: `${product_dimension_attr.find(({ attribute }) => attribute.code == DIMENSION_ATTR.ITEM_LENGTH)?.value} x ${product_dimension_attr.find(({ attribute }) => attribute.code == DIMENSION_ATTR.ITEM_WIDTH)?.value} x ${product_dimension_attr.find(({ attribute }) => attribute.code == DIMENSION_ATTR.ITEM_HEIGHT)?.value}`,
            unit: null,
          },
        ]
      : []),
    ...(country_of_origin
      ? [{ name: "Country of origin", value: country_of_origin, unit: null }]
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
    <section className="order-9 flex h-full flex-col">
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
                    value={`${item.value}` + (item.unit ? ` ${item.unit}` : "")}
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
        <ExtendedDisclosure
          default_open={review_exist}
          heading="Customer Reviews"
          is_last={true}
        >
          {product_reviews?.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-10 text-center">
              <p className="text-lg font-semibold text-gray-900">
                No reviews yet
              </p>
              <p className="text-sm text-gray-600">
                Be the first to review this product
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {!!top_medias.length && (
                <ReviewGallary review_medias={top_medias} />
              )}

              {product_reviews?.map((review) => (
                <ProductReview
                  {...review}
                  product_id={product.id}
                  key={`review-${review.id}`}
                  handleLoginModalState={handleLoginModalState}
                  handleReportModalState={handleReportModalState}
                />
              ))}

              <Link
                href={`/${product_slug}/p/${product.id}/reviews`}
                className="flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white py-2 font-semibold text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600"
              >
                Show all reviews
              </Link>
            </div>
          )}
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
  is_last?: boolean;
}> = ({ children, heading, default_open, is_last = false }) => {
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

          <DisclosurePanel
            className={clsx(
              "overflow-hidden text-gray-600",
              is_last ? "pb-4 sm:pb-0" : "pb-4",
            )}
          >
            {children}
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};
