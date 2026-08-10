// const
import { ANALYTICS_SOURCE_TYPE } from "@/constants/analytics.constant";
import { FREE_SHIPPING_THRESHOLD } from "@/constants/charges.const";

// types
import type { FC } from "react";
import type { IAddress } from "@/types/address";
import type { IResponse as IVerifyPaymentResponse } from "@/hooks/axios/cart/verify-payment-mutation.hook";

// helpers
import clsx from "clsx";
import {
  handlePayment,
  getDeliveryFeeAmountBasedOnTotalAmount,
} from "@/helpers/payment.helper";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useCartCheckoutMutation from "@/hooks/axios/cart/use-cart-checkout-mutation.hook";
import useBuyNowCheckoutMutation from "@/hooks/axios/checkout/use-buy-now-checkout.hook";
import useCreateRazorpayOrderMutation from "@/hooks/axios/cart/create-razorpay-order-mutation.hook";
import useVerifyPaymentMutation from "@/hooks/axios/cart/verify-payment-mutation.hook";
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";
import { useLoginModalContext } from "@/provider/login-modal-provider";

// analytics event
import orderCompletedEvent from "@/analytics/events/order-completed.event";

type IProps = {
  handleOrderSuccess: (order: IVerifyPaymentResponse["order"]) => void;
  selected_address: IAddress | null;
  sub_total: number;
  total_amount: number;
  total_discount: number;
  total_items: number;
  total_mrp: number;
  platform_fee: number;
  type: "buy-checkout" | "cart-checkout";
  intent_id?: string;
};

const CheckoutSummary: FC<IProps> = ({
  handleOrderSuccess,
  selected_address,
  sub_total,
  total_amount,
  total_discount,
  total_items,
  total_mrp,
  platform_fee,
  type,
  intent_id,
}) => {
  const { openModal: openLoginModal } = useLoginModalContext();
  const { openDrawer: openAddressDrawer } = useAddressDrawerContext();
  const buy_now_checkout_mutation = useBuyNowCheckoutMutation();
  const cart_checkout_mutation = useCartCheckoutMutation();
  const create_razorpay_order_mutation = useCreateRazorpayOrderMutation();
  const verify_payment_mutation = useVerifyPaymentMutation();
  const { data: user_detail } = useUserDetails();
  const user_id = user_detail?.id;
  const delivery_fee = getDeliveryFeeAmountBasedOnTotalAmount({
    total_amount,
    delivery_fee: selected_address?.delivery_fee ?? 0,
  });
  const grand_total = total_amount + delivery_fee + platform_fee;
  const delivery_savings =
    total_amount >= FREE_SHIPPING_THRESHOLD
      ? (selected_address?.delivery_fee ?? 0)
      : 0;
  const total_savings = total_discount + delivery_savings + 5; // platform value is hardcoded as 5 for showing savings
  const away_from_free_threshold = FREE_SHIPPING_THRESHOLD - sub_total;
  return (
    <div className="h-max space-y-4 rounded-xl border border-gray-300 bg-white p-6">
      {/* SAVINGS BADGE */}
      {total_savings > 0 && (
        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-700">
          🎉 You will save ₹{total_savings.toLocaleString("en-IN")} on this
          order
        </div>
      )}
      <h3 className="font-bold text-gray-900">Order Summary</h3>

      <div className="space-y-4 text-sm">
        {[
          {
            label: `MRP (${total_items} ${total_items === 1 ? "item" : "items"})`,
            value: `₹${total_mrp}`,
          },
          {
            label: "Discount",
            value: `- ₹${total_discount}`,
          },
          {
            label: "Delivery Fee",
            original_value: selected_address?.delivery_fee,
            value: !!delivery_fee ? `₹${delivery_fee}` : "FREE",
          },
          {
            label: "Platform Fee",
            original_value: 5,
            value: !!platform_fee ? `₹${platform_fee}` : "FREE",
          },
        ].map(({ label, value, original_value }) => {
          const is_free = value == "FREE";
          return (
            <div key={label}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">{label}</span>
                <div className="flex items-center gap-2">
                  {/* Strikethrough original price if free */}
                  {is_free && original_value && (
                    <span className="font-medium text-gray-600 line-through">
                      ₹{original_value}
                    </span>
                  )}
                  <span
                    className={clsx(
                      "font-semibold text-gray-900",
                      label === "Discount" && "text-orange-500",
                    )}
                  >
                    {value}
                  </span>
                </div>
              </div>
              {label === "Delivery Fee" && away_from_free_threshold > 0 && (
                <p className="text-xs font-medium text-orange-500">
                  Add ₹{away_from_free_threshold.toLocaleString("en-IN")} more
                  to unlock free delivery!
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* TOTAL SECTION */}
      <div className="border-t border-dotted border-gray-300 pt-6">
        <div className="flex items-end justify-between">
          {/* Left Side: Labels */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">
              Grand Total
            </span>
            <span className="inline-block w-fit rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200/50 ring-inset">
              Incl. all taxes
            </span>
          </div>

          {/* Right Side: Figure */}
          <div className="text-right">
            <span className="mr-1 text-sm font-semibold text-gray-600">₹</span>
            <span className="text-3xl font-bold tracking-tight text-gray-900">
              {grand_total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 space-y-4">
        <button
          type="button"
          className="w-full cursor-pointer rounded-md bg-orange-500 py-2 font-semibold text-white"
          onClick={() => {
            if (!user_detail) return openLoginModal({});
            if (!selected_address) {
              openAddressDrawer();
              return;
            }
            if (type == "cart-checkout") {
              cart_checkout_mutation.mutate(
                {
                  address_id: selected_address.id,
                },
                {
                  onSuccess(data) {
                    const order_id = data.order_id;
                    create_razorpay_order_mutation.mutate(
                      {
                        order_id,
                      },
                      {
                        onSuccess(data) {
                          handlePayment({
                            ...data,
                            selected_address,
                            total_items,
                            user_phone: user_detail.phone,
                            successHandler(response) {
                              verify_payment_mutation.mutate(
                                {
                                  ...response,
                                  amount: data.amount,
                                  currency: data.currency,
                                },
                                {
                                  onSuccess(response) {
                                    if (user_id) {
                                      response.order.order_items.forEach(
                                        ({
                                          product_id,
                                          variant_id,
                                          quantity,
                                          ...item
                                        }) => {
                                          orderCompletedEvent({
                                            user_id,
                                            product_id,
                                            variant_id,
                                            order_id: Number(order_id),
                                            category_id:
                                              item.product.sub_sub_category_id,
                                            category_type: "SUB_SUB",
                                            quantity,
                                            source:
                                              ANALYTICS_SOURCE_TYPE.CHECKOUT,
                                          });
                                        },
                                      );
                                    }
                                    handleOrderSuccess(response.order);
                                  },
                                },
                              );
                            },
                          });
                        },
                      },
                    );
                  },
                },
              );
            } else {
              buy_now_checkout_mutation.mutate(
                {
                  address_id: selected_address.id,
                  intent_id: intent_id as string,
                },
                {
                  onSuccess(data) {
                    const order_id = data.order_id;
                    create_razorpay_order_mutation.mutate(
                      {
                        order_id,
                      },
                      {
                        onSuccess(data) {
                          handlePayment({
                            ...data,
                            selected_address,
                            total_items,
                            user_phone: user_detail.phone,
                            successHandler(response) {
                              verify_payment_mutation.mutate(
                                {
                                  ...response,
                                  amount: data.amount,
                                  currency: data.currency,
                                },
                                {
                                  onSuccess(response) {
                                    if (user_id) {
                                      response.order.order_items.forEach(
                                        ({
                                          product_id,
                                          variant_id,
                                          quantity,
                                          ...item
                                        }) => {
                                          orderCompletedEvent({
                                            user_id,
                                            product_id,
                                            variant_id,
                                            order_id: Number(order_id),
                                            category_id:
                                              item.product.sub_sub_category_id,
                                            category_type: "SUB_SUB",
                                            quantity,
                                            source:
                                              ANALYTICS_SOURCE_TYPE.CHECKOUT,
                                          });
                                        },
                                      );
                                    }
                                    handleOrderSuccess(response.order);
                                  },
                                },
                              );
                            },
                          });
                        },
                      },
                    );
                  },
                },
              );
            }
          }}
        >
          <span className="relative z-10">Proceed to Pay</span>
        </button>
      </div>
    </div>
  );
};
export default CheckoutSummary;
