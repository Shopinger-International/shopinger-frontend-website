
import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { FC } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { CheckCircle, CreditCard, Clock } from "lucide-react";

type IProps = {
  is_open: boolean;
  order_id?: number;
  order_name?: string;
  total_amount?: number;
  onClose: () => void;
};

const OrderSuccessfulModal: FC<IProps> = ({
  is_open,
  order_id,
  order_name,
  total_amount,
  onClose,
}) => {
  const [animate, setAnimate] = useState(false);
  const router = useRouter();


useEffect(() => {
  if (is_open && order_id) {
    const animationTimer = setTimeout(() => {
      setAnimate(true);
    }, 500);

    const redirectTimer = setTimeout(() => {
      router.push(`/order-detail/${order_id}`);
    }, 5000);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(redirectTimer);
    };
  } else {
    setAnimate(false);
  }
}, [is_open, order_id, router]);

  return (
    <Transition show={is_open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" />
        </TransitionChild>

        {/* Modal container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90 translate-y-5"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-3"
          >
            <DialogPanel className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Top accent */}
              <div className="h-1.5 bg-orange-500" />

              <div className="p-6 text-center">
                {/* Success Icon */}
                <div className="mb-5 flex justify-center">
                  <div className="relative">
                    {/* Ripple */}
                    <div
                      className={`absolute inset-0 rounded-full bg-orange-200 transition-all duration-700 ${
                        animate
                          ? "scale-125 opacity-0"
                          : "scale-75 opacity-60"
                      }`}
                    />

                    {/* Icon circle */}
                    <div
                      className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 shadow-sm transition-all duration-500 ${
                        animate
                          ? "scale-100 rotate-0 opacity-100"
                          : "scale-50 rotate-[-12deg] opacity-0"
                      }`}
                    >
                      <CheckCircle
                        size={42}
                        strokeWidth={2.2}
                        className={`text-orange-500 transition-all duration-500 ${
                          animate
                            ? "scale-100 opacity-100"
                            : "scale-50 opacity-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div
                  className={`transition-all duration-500 ${
                    animate
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  }`}
                >
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    Order Confirmed
                  </DialogTitle>

                  <p className="mt-2 text-sm leading-5 text-gray-600">
                    Your order has been placed successfully and will be
                    delivered soon.
                  </p>
                </div>

                {/* Order Info */}
                <div
                  className={`mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition-all duration-500 delay-100 ${
                    animate
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  }`}
                >
                  <div className="space-y-3 text-sm">
                    {/* Order ID */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Order ID</span>

                      <span className="font-medium text-gray-800">
                        {order_name}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-gray-500">
                        <CreditCard size={14} />
                        Amount
                      </span>

                      <span className="font-semibold text-gray-900">
                        ₹{total_amount}
                      </span>
                    </div>

                    {/* Delivery */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock size={14} />
                        Delivery
                      </span>

                      <span className="font-medium text-gray-800">
                        Same Day
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className={`mt-6 flex gap-3 transition-all duration-500 delay-200 ${
                    animate
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  }`}
                >
                  <Link
                    href={`/order-detail/${order_id}`}
                    className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 active:translate-y-0"
                  >
                    Close
                  </Link>

                  <Link
                    href={`/order-detail/${order_id}`}
                    className="flex flex-1 items-center justify-center rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OrderSuccessfulModal;
