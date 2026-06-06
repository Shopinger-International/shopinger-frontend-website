// types
import type { ICancelReason } from "@/types/order";

// external components
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import type IOrder from "@/types/order";

// local  components
import CancelOrderItem from "@/components/order-details/cancel-order-item.component";
import SelectInput from "../common/select-input.component";

// hooks
import useCancelOrderMutation from "@/hooks/axios/order/use-cancel-order-mutation.hook";

// icons
import { X } from "lucide-react";

// react query
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  is_open: boolean;
  order: IOrder;
  onClose: () => void;
  onConfirm: (data: {
    items: { id: number; quantity: number }[];
    reason: ICancelReason;
  }) => void;
};

const reasons: { label: string; value: ICancelReason }[] = [
  { label: "Ordered by mistake", value: "ORDER_BY_MISTAKE" },
  { label: "Found a better price elsewhere", value: "FOUND_BETTER_PRICE" },
  { label: "Delivery taking too long", value: "DELAYED_DELIVERY" },
  { label: "Changed my mind", value: "CHANGE_OF_MIND" },
  { label: "Placed duplicate order", value: "DUPLICATE_ORDER" },
  { label: "Wrong item ordered", value: "WRONG_ITEM_ORDERED" },
  { label: "Item no longer needed", value: "NO_LONGER_NEEDED" },
  { label: "Shipping cost too high", value: "HIGH_SHIPPING_COST" },
  { label: "Product reviews changed my mind", value: "BAD_REVIEWS" },
  {
    label: "Item expected to arrive too late",
    value: "LATE_DELIVERY_EXPECTED",
  },
  { label: "Other", value: "OTHER" },
];

export default function CancelOrderModal({ is_open, order, onClose }: Props) {
  const query_client = useQueryClient();
  const cancel_order_mutation = useCancelOrderMutation();
  const [selected_items, setSelectedItems] = useState<
    { item_id: number; quantity: number }[]
  >([]);
  const [reason, setReason] = useState<ICancelReason | "">("");

  return (
    <Transition show={is_open} as={Fragment}>
      <Dialog
        onClose={() => {
          onClose();
          setSelectedItems([]);
        }}
        className="relative z-50"
      >
        {/* backdrop */}
        <TransitionChild as={Fragment}>
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild as={Fragment}>
            <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">
                  Cancel Items
                </DialogTitle>

                <button
                  onClick={() => {
                    onClose();
                    setSelectedItems([]);
                  }}
                  className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  aria-label="Close modal"
                >
                  <X className="size-5" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Select items and quantity to cancel
              </p>
              {/* ITEMS */}
              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                {order.order_items.flatMap(
                  ({ item_id, item, quantity, cancelled_quantity }) =>
                    item.variants.map((variant) => {
                      const selected_item = selected_items.find(
                        (i) => i.item_id === item_id,
                      );

                      const is_selected = !!selected_item;

                      const selected_quantity = selected_item?.quantity ?? 0;
                      const left_quantity = quantity - cancelled_quantity;
                      if (!left_quantity) return null;
                      return (
                        <CancelOrderItem
                          key={variant.id}
                          product={item}
                          variant={variant}
                          quantity={left_quantity}
                          is_selected={is_selected}
                          selected_quantity={selected_quantity}
                          onToggle={() => {
                            setSelectedItems((prev) => {
                              const exists = prev.find(
                                (i) => i.item_id === item_id,
                              );

                              if (exists) {
                                // remove item
                                return prev.filter(
                                  (i) => i.item_id !== item_id,
                                );
                              }

                              // add item with default quantity = 1
                              return [
                                ...prev,
                                {
                                  item_id,
                                  quantity: 1,
                                },
                              ];
                            });
                          }}
                          onQuantityChange={(updated_quantity) => {
                            setSelectedItems((prev) => {
                              const exists = prev.find(
                                (i) => i.item_id === item_id,
                              );

                              if (!exists) return prev;

                              return prev.map((i) =>
                                i.item_id === item_id
                                  ? {
                                      ...i,
                                      quantity: Math.max(
                                        0,
                                        Math.min(quantity, updated_quantity),
                                      ),
                                    }
                                  : i,
                              );
                            });
                          }}
                        />
                      );
                    }),
                )}
              </div>
              {/* REASON */}
              <div className="mt-4">
                <p className="text-sm font-medium">Reason for cancellation</p>

                <div className="mt-2 space-y-4">
                  <SelectInput
                    instance_id="reason"
                    options={reasons}
                    value={
                      reasons.find((opt) => opt.value === reason)?.value || null
                    }
                    placeholder="Select a reason"
                    onChange={(value) => {
                      setReason(value as ICancelReason);
                    }}
                  />
                  {reason == "OTHER" && (
                    <textarea
                      rows={4}
                      placeholder="Reason for order cancelling"
                      className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:outline-orange-500"
                    />
                  )}
                </div>
              </div>
              {/* ACTIONS */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    onClose();
                    setSelectedItems([]);
                  }}
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    if (reason !== "") {
                      cancel_order_mutation.mutate(
                        {
                          order_id: order.id,
                          items: selected_items,
                          reason,
                        },
                        {
                          onSuccess() {
                            onClose();
                            query_client.invalidateQueries({
                              queryKey: ["order", String(order.id)],
                            });
                            setSelectedItems([]);
                          },
                        },
                      );
                    }
                  }}
                  disabled={
                    !reason ||
                    selected_items.length === 0 ||
                    cancel_order_mutation.isPending
                  }
                  className="rounded-md bg-red-500 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {cancel_order_mutation.isPending
                    ? "Cancelling"
                    : "Request Cancellation"}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
