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

// helpers

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
  onConfirm: (data: {
    items: { id: number; quantity: number }[];
    reason: CancelReason;
  }) => void;
};

const reasons: { label: string; value: CancelReason }[] = [
  { label: "Ordered by mistake", value: "ORDER_BY_MISTAKE" },
  { label: "Found better price", value: "FOUND_BETTER_PRICE" },
  { label: "Delivery taking too long", value: "DELAYED_DELIVERY" },
  { label: "Changed my mind", value: "CHANGE_OF_MIND" },
  { label: "Other", value: "OTHER" },
];

export default function CancelOrderModal({ is_open, order, onClose }: Props) {
  const [selected_items, setSelectedItems] = useState<
    { variant_id: number; quantity: number }[]
  >([]);
  const [reason, setReason] = useState<CancelReason | "">("");

  return (
    <Transition show={is_open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* backdrop */}
        <TransitionChild as={Fragment}>
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild as={Fragment}>
            <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <DialogTitle className="text-lg font-semibold">
                Cancel Items
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-600">
                Select items and quantity to cancel
              </p>
              {/* ITEMS */}
              <div className="mt-4 space-y-3 overflow-y-auto max-h-64">
                {order.order_items.flatMap(({ item, quantity }) =>
                  item.variants.map((variant) => {
                    const selected_item = selected_items.find(
                      (i) => i.variant_id === variant.id,
                    );

                    const is_selected = !!selected_item;

                    const selected_quantity = selected_item?.quantity ?? 0;

                    return (
                      <CancelOrderItem
                        key={variant.id}
                        product={item}
                        variant={variant}
                        quantity={quantity}
                        is_selected={is_selected}
                        selected_quantity={selected_quantity}
                        onToggle={() => {
                          setSelectedItems((prev) => {
                            const exists = prev.find(
                              (i) => i.variant_id === variant.id,
                            );

                            if (exists) {
                              // remove item
                              return prev.filter(
                                (i) => i.variant_id !== variant.id,
                              );
                            }

                            // add item with default quantity = 1
                            return [
                              ...prev,
                              {
                                variant_id: variant.id,
                                quantity: 1,
                              },
                            ];
                          });
                        }}
                        onQuantityChange={(updated_quantity) => {
                          setSelectedItems((prev) => {
                            const exists = prev.find(
                              (i) => i.variant_id === variant.id,
                            );

                            if (!exists) return prev;

                            return prev.map((i) =>
                              i.variant_id === variant.id
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
              <div className="mt-5">
                <p className="text-sm font-medium">Reason for cancellation</p>

                <div className="mt-2">
                  <SelectInput
                    options={reasons}
                    value={
                      reasons.find((opt) => opt.value === reason)?.value || null
                    }
                    placeholder="Select a reason"
                    onChange={(value) => {
                      setReason(value as CancelReason);
                    }}
                  />
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
                  // onClick={handleSubmit}
                  disabled={!reason || selected_items.length === 0}
                  className="rounded-md bg-red-500 px-4 py-2 text-sm text-white disabled:opacity-50"
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
