import { useRouter } from "next/router";
import Link from "next/link";
// types
import type { FC } from "react";
import type { IAddress } from "@/types/address";

// helpers
import clsx from "clsx";
import { handlePayment } from "@/helpers/payment.helper";

// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useCartCheckoutMutation from "@/hooks/axios/cart/use-cart-checkout-mutation.hook";
import useCreateRazorpayOrderMutation from "@/hooks/axios/cart/create-razorpay-order-mutation.hook";
import useVerifyPaymentMutation from "@/hooks/axios/cart/verify-payment-mutation.hook";

type IProps = {
  handleShowLoginModal: () => void;
  handleShowAddresDrawer: () => void;
  selected_address: IAddress | null;
  sub_total: number;
  total_amount: number;
  total_discount: number;
  total_items: number;
  charges: number;
};

const CartSummary: FC<IProps> = ({
  handleShowLoginModal,
  handleShowAddresDrawer,
  selected_address,
  sub_total,
  total_amount,
  total_discount,
  total_items,
  charges,
}) => {
  const router = useRouter();
  const cart_checkout_mutation = useCartCheckoutMutation();
  const create_razorpay_order_mutation = useCreateRazorpayOrderMutation();
  const verify_payment_mutation = useVerifyPaymentMutation();
  const { data: user_detail } = useUserDetails();
  return (
    <div className="h-max space-y-4 rounded-xl border border-gray-300 bg-white p-6">
      <h3 className="font-bold text-gray-900">Order Summary</h3>

      <div className="space-y-4 text-sm">
        {[
          {
            label: "Subtotal",
            value: `₹${sub_total}`,
          },
          {
            label: "Discount",
            value: `- ₹${total_discount}`,
          },
          {
            label: "Shipping",
            value: charges ? `₹${charges}` : "FREE",
          },
        ].map(({ label, value }) => (
          <div className="flex items-center justify-between" key={label}>
            <span className="font-medium text-gray-600">{label}</span>
            <span
              className={clsx(
                "font-semibold text-gray-900",
                label === "Discount" && "text-orange-500",
              )}
            >
              {value}
            </span>
          </div>
        ))}
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
              {total_amount.toLocaleString("en-IN")}
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
            if (!user_detail) return handleShowLoginModal();
            if (!selected_address) {
              handleShowAddresDrawer();
              return;
            }
            cart_checkout_mutation.mutate(
              {
                address_id: selected_address.id,
              },
              {
                onSuccess(data) {
                  create_razorpay_order_mutation.mutate(
                    {
                      order_id: data.order_id,
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
                                  router.push(
                                    `/order-detail/${response.order.id}`,
                                  );
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
          }}
        >
          <span className="relative z-10">Proceed to Pay</span>
        </button>

        <Link
          href="/"
          className="flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white py-2 font-medium text-gray-900"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
export default CartSummary;
