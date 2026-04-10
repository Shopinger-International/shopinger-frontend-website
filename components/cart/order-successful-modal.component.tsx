// types
import type { FC } from "react";

// external component
import { Dialog } from "@headlessui/react";

// icons
import { CheckCircle } from "lucide-react";

type IProps = {
  is_open: boolean;
  onClose: () => void;
  order_id?: string;
};
const OrderSuccessfulModal: FC<IProps> = ({ is_open, onClose, order_id }) => {
  return (
    <Dialog open={is_open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Centered Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <Dialog.Title className="mb-2 text-xl font-semibold">
            Order Confirmed 🎉
          </Dialog.Title>

          <p className="mb-4 text-gray-600">
            Your order has been successfully placed.
          </p>

          {order_id && (
            <p className="mb-6 text-sm text-gray-500">
              Order ID: <span className="font-medium">{order_id}</span>
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-100 py-2 hover:bg-gray-200"
            >
              Close
            </button>

            <button
              onClick={() => {
                window.location.href = "/orders";
              }}
              className="flex-1 rounded-xl bg-black py-2 text-white hover:bg-gray-800"
            >
              View Orders
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OrderSuccessfulModal;
