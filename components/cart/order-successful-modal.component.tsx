import { useEffect, useState, Fragment } from "react";
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
  total_amount?: number;
  onClose: () => void;
};

const OrderSuccessfulModal: FC<IProps> = ({
  is_open,
  onClose,
  order_id,
  total_amount,
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (is_open) {
      const t = setTimeout(() => setAnimate(true), 200);
      return () => clearTimeout(t);
    } else {
      setAnimate(false);
    }
  }, [is_open]);

  return (
    <Transition show={is_open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90 translate-y-6"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <DialogPanel className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Top Gradient */}
              <div className="h-2 bg-orange-500" />

              <div className="p-6 text-center">
                {/* Icon */}
                <div className="mb-5 flex justify-center">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 shadow-sm transition-all duration-500 ${animate ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-45 opacity-0"}`}
                  >
                    <CheckCircle className="text-orange-500" size={40} />
                  </div>
                </div>

                {/* Title */}
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Order Confirmed 🎉
                </DialogTitle>

                <p className="mt-2 text-sm text-gray-600">
                  Your order has been placed successfully and will be delivered
                  soon.
                </p>

                {/* Order Info Card */}
                <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID</span>
                      <span className="font-medium text-gray-800">
                        {order_id}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 text-gray-500">
                        <CreditCard size={14} />
                        Amount
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{total_amount}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock size={14} />
                        Delivery
                      </span>
                      <span className="text-gray-800">Same Day</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                  >
                    Close
                  </button>

                  <Link
                    href={`/order-detail/${order_id}`}
                    className="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-medium text-white transition hover:bg-orange-600 active:scale-95"
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
