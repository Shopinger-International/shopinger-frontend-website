import Link from "next/link";
import { useRouter } from "next/router";

// const
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";

// types
import type { FC } from "react";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type { IReportModalState } from "@/pages/[product_slug]/p/[product_id]/reviews";
import type { ILoginModalState } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
import type { IFormattedCategoryMapping } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// icons
import { Star, ChevronDown } from "lucide-react";

// local components
import Badge from "@/components/product/badge.component";
import VariantSelection from "@/components/product/variant-selection.component";
import CheckDeliveryAvailability from "@/components/product/product-info/check-delivery-availability.component";
import ProductDetails from "@/components/product/product-info/product-details.component";
import MobileProductGallary from "@/components/product/product-gallary/mobile-product-gallary.component";
import RatingSummaryPopover from "@/components/categories/rating-summary-popover.component";
import DeliveryDetails from "@/components/product/product-info/delivery-details.component";

// api hooks
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";
import useCreateBuyingIntentMutation from "@/hooks/axios/checkout/use-create-buying-intent-mutation.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// hooks
import { useLoginModalContext } from "@/provider/login-modal-provider";

// helpers
import { generateSlug } from "@/helpers/product.helper";

// lib
import insightsClient from "@/lib/algolia/algolia-insight.lib";

// analytics events
import addedToCartEvent from "@/analytics/events/added-to-cart.event";
import buyNowClickedEvent from "@/analytics/events/buy-now-clicked.event";

type IProps = {
  product: IProduct;
  variant: IVariant;
  selected_attributes: Record<string, any>;
  category_mappings: Array<IFormattedCategoryMapping>;
  is_product_available: boolean;
  handleReportModalState: ({ open, review_id }: IReportModalState) => void;
};

const ProductInfo: FC<IProps> = ({
  product,
  variant,
  selected_attributes,
  category_mappings,
  is_product_available,
  handleReportModalState,
}) => {
  const { openModal: openLoginModal } = useLoginModalContext();
  const router = useRouter();
  const { data: user_details } = useUserDetails();
  const user_id = user_details?.id;
  const is_logged_in = !!user_details;
  const create_buying_intent_mutation = useCreateBuyingIntentMutation();
  const add_to_cart_mutation = useAddToCartMutation();
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

  const product_slug = generateSlug(product.title);
  const nor_visual_variant_attributes = variant.variant_attribute_values
    .filter(
      ({ attribute }) =>
        !category_mappings.find(
          (mapping) => mapping.attribute_id == attribute.id,
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
          (mapping) => mapping.attribute_id == attribute.id,
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
        {mrp !== selling_price_with_commission && (
          <p>
            <span className="text-gray-600">M.R.P</span>{" "}
            <span className="line-through">₹{mrp}</span>
          </p>
        )}

        <p className="text-sm">Inclusive of all taxes</p>
      </section>

      {/** RATING */}
      <section className="order-5">
        <h2 className="sr-only">Product rating</h2>
        <p className="mb-4" aria-label="Product rating and reviews">
          <RatingSummaryPopover
            product_id={product.id}
            product_reviews_link={`/${product_slug}/p/${product.id}/reviews`}
          >
            <span className="inline-flex cursor-pointer items-center gap-1">
              <strong className="font-medium">4.6 </strong>{" "}
              <span className="sr-only">out of 5 stars</span>{" "}
              <Star
                className="inline size-4 fill-amber-300 text-amber-300"
                aria-hidden="true"
              />
              <ChevronDown
                className="inline-block size-4 text-orange-500"
                strokeWidth={2.5}
              />
            </span>
          </RatingSummaryPopover>
          <span aria-hidden="true"> | </span>{" "}
          <Link
            href={`/${product_slug}/p/${product.id}/reviews`}
            className="text-orange-500"
            aria-label={`view all ${2847} reviews`}
          >
            2,847 reviews
          </Link>{" "}
          <span className="inline">500+ bought in past month</span>
        </p>
      </section>

      <VariantSelection
        product={product}
        selected_attributes={selected_attributes}
        category_mappings={category_mappings}
      />
      <CheckDeliveryAvailability />
      <DeliveryDetails />
      <p className="order-6 mb-4 font-medium">
        Sold by{" "}
        <strong className="font-medium text-orange-500">Himang Retails</strong>
      </p>
      <ProductDetails
        product={product}
        category_mappings={category_mappings}
        handleReportModalState={handleReportModalState}
      />
      <div
        id="buy-cta-container"
        className="fixed bottom-0 left-0 z-4 flex w-full gap-3 border-t border-gray-300 bg-white px-4 py-3 shadow-md lg:sticky lg:border-none lg:px-0 lg:shadow-none"
      >
        <button
          onClick={() => {
            add_to_cart_mutation.mutate(
              {
                product_id: product.id,
                variant_id: variant.id,
                quantity: 1,
              },
              {
                onSuccess() {
                  addedToCartEvent({
                    user_id,
                    product_id: product.id,
                    variant_id: variant.id,
                    category_id: product.sub_sub_category_id,
                    category_type: "SUB_SUB",
                    source: ANALYTICS_SOURCE_TYPE.PRODUCT_DETAILS,
                  });

                  const query = router.query;
                  const query_id =
                    typeof query.query_id === "string"
                      ? query.query_id
                      : undefined;

                  const index_name =
                    typeof query.index_name === "string"
                      ? query.index_name
                      : undefined;

                  const object_id =
                    typeof query.object_id === "string"
                      ? query.object_id
                      : undefined;

                  query_id &&
                    index_name &&
                    object_id &&
                    insightsClient("addedToCartObjectIDsAfterSearch", {
                      eventName: "Add to Cart",
                      index: index_name,
                      queryID: query_id,
                      objectIDs: [object_id],
                      objectData: [
                        {
                          price: selling_price_with_commission,
                          discount: mrp - selling_price_with_commission,
                          quantity: 1,
                        },
                      ],
                      value: selling_price_with_commission,
                      currency: "INR",
                    });
                },
              },
            );
          }}
          disabled={add_to_cart_mutation.isPending || !is_product_available}
          className="w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 font-semibold text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
        >
          Add to cart
        </button>
        <button
          className="w-full cursor-pointer rounded-md bg-orange-500 py-2 font-semibold text-white disabled:bg-orange-300"
          disabled={
            create_buying_intent_mutation.isPending || !is_product_available
          }
          onClick={() => {
            user_id &&
              buyNowClickedEvent({
                user_id,
                product_id: product.id,
                variant_id: variant.id,
                category_id: product.sub_sub_category_id,
                category_type: "SUB_SUB",
                source: ANALYTICS_SOURCE_TYPE.PRODUCT_DETAILS,
              });
            if (is_logged_in) {
              create_buying_intent_mutation.mutate(
                {
                  product_id: product.id,
                  variant_id: variant.id,
                  quantity: 1,
                },
                {
                  onSuccess({ intent_id }) {
                    const query = router.query;
                    const query_id =
                      typeof query.query_id === "string"
                        ? query.query_id
                        : undefined;

                    const index_name =
                      typeof query.index_name === "string"
                        ? query.index_name
                        : undefined;

                    const object_id =
                      typeof query.object_id === "string"
                        ? query.object_id
                        : undefined;
                    router.push({
                      pathname: `/checkout/${intent_id}`,
                      query: {
                        ...(query_id ? { query_id } : {}),
                        ...(index_name ? { index_name } : {}),
                        ...(object_id ? { object_id } : {}),
                      },
                    });
                  },
                },
              );
            } else {
              openLoginModal({
                onSuccess(user) {
                  if (user) {
                    create_buying_intent_mutation.mutate(
                      {
                        product_id: product.id,
                        variant_id: variant.id,
                        quantity: 1,
                      },
                      {
                        onSuccess({ intent_id }) {
                          router.push(`/checkout/${intent_id}`);
                          const query = router.query;
                          const query_id =
                            typeof query.query_id === "string"
                              ? query.query_id
                              : undefined;

                          const index_name =
                            typeof query.index_name === "string"
                              ? query.index_name
                              : undefined;

                          const object_id =
                            typeof query.object_id === "string"
                              ? query.object_id
                              : undefined;
                          router.push({
                            pathname: `/checkout/${intent_id}`,
                            query: {
                              ...(query_id ? { query_id } : {}),
                              ...(index_name ? { index_name } : {}),
                              ...(object_id ? { object_id } : {}),
                            },
                          });
                        },
                      },
                    );
                  }
                },
                onCancel() {},
              });
            }
          }}
        >
          Buy Now
        </button>
      </div>
    </section>
  );
};
export default ProductInfo;
