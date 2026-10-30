import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// const
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";

// types
import { type FC } from "react";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type { IReportModalState } from "@/pages/[product_slug]/p/[product_id]/reviews";
import type { IFormattedCategoryMapping } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// icons
import { Star, ChevronDown, ArrowDown, Minus, Plus } from "lucide-react";

// local components
import VariantSelection from "@/components/product/variant-selection.component";
import ProductDetails from "@/components/product/product-info/product-details.component";
import MobileProductGallary from "@/components/product/product-gallary/mobile-product-gallary.component";
import RatingSummaryPopover from "@/components/categories/rating-summary-popover.component";
import DeliveryDetails from "@/components/product/product-info/delivery-details.component";

// api hooks
import useAddToCartMutation from "@/hooks/axios/cart/use-add-to-cart-mutation.hook";
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useCartItemIncreaseMutation from "@/hooks/axios/cart/use-cart-item-increase-mutation.hook";
import useCartItemDecreaseMutation from "@/hooks/axios/cart/use-cart-item-decrease-mutation.hook";
import useCartItemRemoveMutation from "@/hooks/axios/cart/use-cart-item-remove-mutation.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";

// lib
import insightsClient from "@/lib/algolia/algolia-insight.lib";

// analytics events
import addedToCartEvent from "@/analytics/events/added-to-cart.event";

type IProps = {
  product: IProduct;
  variant: IVariant;
  selected_attributes: Record<string, any>;
  category_mappings: Array<IFormattedCategoryMapping>;
  is_product_available: boolean;
  handleReportModalState: ({
    open,
    review_id,
    source,
  }: IReportModalState) => void;
};

const ProductInfo: FC<IProps> = ({
  product,
  variant,
  selected_attributes,
  category_mappings,
  is_product_available,
  handleReportModalState,
}) => {
  const router = useRouter();
  const { data: user_details } = useUserDetails();
  const user_id = user_details?.id;
  const { data: cart_data, refetch: refetch_cart } = useCart();
  const add_to_cart_mutation = useAddToCartMutation();
  const increase_mutation = useCartItemIncreaseMutation();
  const decrease_mutation = useCartItemDecreaseMutation();
  const remove_mutation = useCartItemRemoveMutation();
  const [pending_quantity, setPendingQuantity] = useState<number | null>(null);
  const cart_quantity =
    cart_data?.items
      .find((item) => item.id === product.id)
      ?.variants.find((cart_variant) => cart_variant.id === variant.id)
      ?.selected_stock ?? 0;
  const display_quantity = pending_quantity ?? cart_quantity;
  const is_quantity_mutation_pending =
    pending_quantity !== null ||
    add_to_cart_mutation.isPending ||
    increase_mutation.isPending ||
    decrease_mutation.isPending ||
    remove_mutation.isPending;

  const refreshCart = async () => {
    try {
      await refetch_cart();
    } finally {
      setPendingQuantity(null);
    }
  };

  const { title, brand } = product;
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
  const initializeAffordabilityWidget = () => {
    if (!window.RazorpayAffordabilitySuite) return;

    const container = document.getElementById("razorpay-affordability-widget");

    if (!container) return;

    container.innerHTML = "";

    const widget = new window.RazorpayAffordabilitySuite({
      key: process.env.NEXT_PUBLIC_RAZORPAYKEY_ID!,
      amount: selling_price_with_commission * 100,
    });

    widget.render();
  };

  useEffect(() => {
    if (window.RazorpayAffordabilitySuite) {
      initializeAffordabilityWidget();
    }
  }, [selling_price_with_commission]);
  return (
    <>
      <Script
        src="https://cdn.razorpay.com/widgets/affordability/affordability.js"
        strategy="afterInteractive"
        onLoad={initializeAffordabilityWidget}
      />
      <section
        aria-labelledby="product-title"
        className="flex flex-col lg:block"
      >
        <MobileProductGallary
          variant={variant}
          product={product}
          category_mappings={category_mappings}
        />
        {/** MRP */}
        <section className="order-4 mb-4 flex flex-col">
          <h1
            id="product-title"
            className="mb-2 text-sm font-semibold lg:mb-3 lg:text-xl lg:font-medium"
          >
            {heading}
          </h1>
          <h2 className="sr-only">Price</h2>
          <p>
            <span className="mr-5 inline-block rounded-md bg-green-700 px-2 py-1 text-2xl text-white lg:text-3xl">
              ₹{selling_price_with_commission}{" "}
            </span>
            {!!discount_percentage && (
              <>
                <span className="text-brand inline-flex items-center font-bold">
                  {discount_percentage}%
                  <span className="sr-only">discount</span>
                  <ArrowDown
                    className="text-brand inline size-4"
                    strokeWidth={3.5}
                  />
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
          <div id="razorpay-affordability-widget" />
        </section>

        {/** RATING */}
        <section className="order-5">
          <h2 className="sr-only">Product rating</h2>
          <p className="mb-4" aria-label="Product rating and reviews">
            <RatingSummaryPopover
              product_id={product.id}
              product_reviews_link={`/${product_slug}/p/${product.id}/reviews`}
            >
              <span className="bg-rating-green inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold text-white shadow-2xs transition-opacity hover:opacity-90">
                <span>{Number(product.average_rating).toFixed(1)}</span>
                <Star
                  className="size-3 fill-white text-white"
                  aria-hidden="true"
                />
                <ChevronDown
                  className="size-3.5 text-white"
                  strokeWidth={2.5}
                />
              </span>
            </RatingSummaryPopover>
            <span aria-hidden="true"> | </span>{" "}
            <Link
              href={`/${product_slug}/p/${product.id}/reviews`}
              className="text-brand"
              aria-label={`view all ${product.total_reviews ?? 0} reviews`}
            >
              {product.total_reviews} reviews
            </Link>{" "}
            <span className="inline">10+ bought in past month</span>
          </p>
        </section>

        <VariantSelection
          product={product}
          selected_attributes={selected_attributes}
          category_mappings={category_mappings}
        />
        {/* <CheckDeliveryAvailability /> */}
        <DeliveryDetails />

        <ProductDetails
          product={product}
          category_mappings={category_mappings}
          handleReportModalState={handleReportModalState}
        />
        <div
          id="buy-cta-container"
          className="fixed bottom-0 left-0 z-30 flex w-full gap-3 border-t border-gray-300 bg-white px-4 py-3 shadow-md md:z-30 lg:sticky lg:z-10 lg:border-none lg:px-0 lg:shadow-none"
        >
          {display_quantity > 0 ? (
            <div className="border-brand bg-brand flex w-full items-center justify-between rounded-md border py-2 font-semibold text-white">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={is_quantity_mutation_pending}
                className="flex flex-1 cursor-pointer justify-center disabled:cursor-not-allowed"
                onClick={() => {
                  const next_quantity = Math.max(0, display_quantity - 1);
                  setPendingQuantity(next_quantity);

                  if (cart_quantity > 1) {
                    decrease_mutation.mutate(
                      { variant_id: variant.id },
                      {
                        onSuccess: refreshCart,
                        onError: () => setPendingQuantity(null),
                      },
                    );
                  } else {
                    remove_mutation.mutate(
                      { product_id: product.id, variant_id: variant.id },
                      {
                        onSuccess: refreshCart,
                        onError: () => setPendingQuantity(null),
                      },
                    );
                  }
                }}
              >
                <Minus className="size-5" aria-hidden="true" />
              </button>
              <span aria-live="polite">{display_quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={is_quantity_mutation_pending || !is_product_available}
                className="flex flex-1 cursor-pointer justify-center disabled:cursor-not-allowed"
                onClick={() => {
                  setPendingQuantity(display_quantity + 1);
                  increase_mutation.mutate(
                    { variant_id: variant.id },
                    {
                      onSuccess: refreshCart,
                      onError: () => setPendingQuantity(null),
                    },
                  );
                }}
              >
                <Plus className="size-5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setPendingQuantity(1);
                add_to_cart_mutation.mutate(
                  {
                    product_id: product.id,
                    variant_id: variant.id,
                    quantity: 1,
                  },
                  {
                    async onSuccess() {
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

                      await refreshCart();
                    },
                    onError() {
                      setPendingQuantity(null);
                    },
                  },
                );
              }}
              disabled={is_quantity_mutation_pending || !is_product_available}
              className="bg-brand w-full cursor-pointer rounded-md border border-gray-300 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
            >
              Add to cart
            </button>
          )}
        </div>
      </section>
    </>
  );
};
export default ProductInfo;
