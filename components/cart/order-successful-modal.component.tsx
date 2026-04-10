import Link from "next/link";
// types
import type { FC } from "react";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

import { CheckCircle } from "lucide-react";

type IProps = {
  is_open: boolean;
  order_id?: string;
  onClose: () => void;
};

const OrderSuccessfulModal: FC<IProps> = ({ is_open, onClose, order_id }) => {
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
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
              {/* Icon with rotation animation */}
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-orange-100 p-3">
                  <TransitionChild
                    as={Fragment}
                    enter="transform transition duration-500 ease-out"
                    enterFrom="rotate-[-180deg] scale-50 opacity-0"
                    enterTo="rotate-0 scale-100 opacity-100"
                  >
                    <CheckCircle className="h-12 w-12 text-orange-500" />
                  </TransitionChild>
                </div>
              </div>

              {/* Title */}
              <DialogTitle className="mb-2 text-xl font-semibold">
                Order Confirmed 🎉
              </DialogTitle>

              {/* Description */}
              <p className="mb-4 text-gray-600">
                Your order has been successfully placed.
              </p>

              {/* Order ID */}
              {order_id && (
                <p className="mb-6 text-sm text-gray-500">
                  Order ID:{" "}
                  <span className="font-medium text-gray-700">{order_id}</span>
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-2 font-medium text-gray-600 transition hover:bg-gray-100"
                >
                  Close
                </button>

                <Link
                  href={`/order-detail/${order_id}`}
                  className="flex-1 rounded-lg bg-orange-500 py-2 font-medium text-white transition hover:bg-orange-600"
                >
                  View Order
                </Link>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OrderSuccessfulModal;
