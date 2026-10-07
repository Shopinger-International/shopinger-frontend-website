import type { FC } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bell, Check, X } from "lucide-react";

type IProps = {
  is_open: boolean;
  onClose: () => void;
};

const RequestAcceptedModal: FC<IProps> = ({ is_open, onClose }) => {
  return (
    <Dialog open={is_open} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl transition-all">

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>

          <div className="mx-auto mb-4 flex items-center justify-center pt-2">
            <div className="relative flex size-16 items-center justify-center rounded-full bg-[#FFE2D0]">
              <Bell className="size-8 text-[#FF6801] fill-[#FF6801]" />
              <span className="absolute top-0 right-0 flex size-6 items-center justify-center rounded-full bg-[#22C55E] text-white ring-2 ring-white shadow-xs">
                <Check className="size-3.5 stroke-[3]" />
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900">
            Request Accepted
          </h3>
          <p className="mt-2 text-sm font-medium text-gray-600 leading-relaxed px-2">
            We'll notify you as soon as this product is back in stock.
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default RequestAcceptedModal;
