import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import type IOrder from "@/types/order";
import clsx from "clsx";

// local components
import CancelOrderItem from "./cancel-order-item.component";

type CancelReason =
  | "ORDER_BY_MISTAKE"
  | "FOUND_BETTER_PRICE"
  | "DELAYED_DELIVERY"
  | "CHANGE_OF_MIND"
  | "OTHER";

type Props = {
  is_open: boolean;
  order: IOrder;
  onClose: () => void;
  onConfirm: (data: { items: number[]; reason: CancelReason }) => void;
};

const reasons: { label: string; value: CancelReason }[] = [
  { label: "Ordered by mistake", value: "ORDER_BY_MISTAKE" },
  { label: "Found better price", value: "FOUND_BETTER_PRICE" },
  { label: "Delivery taking too long", value: "DELAYED_DELIVERY" },
  { label: "Changed my mind", value: "CHANGE_OF_MIND" },
  { label: "Other", value: "OTHER" },
];

export default function CancelOrderModal({
  is_open,
  order,
  onClose,
  onConfirm,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [reason, setReason] = useState<CancelReason | "">("");

  const toggleItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    if (!reason || selectedItems.length === 0) return;

    onConfirm({
      items: selectedItems,
      reason: reason as CancelReason,
    });
  };

  return (
    <Transition show={is_open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Cancel Items
              </DialogTitle>

              <p className="mt-1 text-sm text-gray-600">
                Select items you want to cancel and provide a reason.
              </p>

              {/* ITEMS */}
              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                {order.order_items.map((item) => {
                  const product = item.item;
                  const variant = product.variants[0];

                  return (
                    <CancelOrderItem
                      product={product}
                      variant={variant}
                      quantity={item.quantity}
                    />
                  );
                })}
              </div>

              {/* REASON */}
              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700">
                  Reason for cancellation
                </label>

                <div className="mt-2 grid gap-2">
                  {reasons.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setReason(r.value)}
                      className={clsx(
                        "rounded-lg border p-2 text-left text-sm transition",
                        reason === r.value
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Close
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={!reason || selectedItems.length === 0}
                  className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  Cancel Selected Items
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
