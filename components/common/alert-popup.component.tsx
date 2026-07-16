import Image from "next/image";
// types
import type { FC } from "react";

// external component
import { Dialog, DialogBackdrop, DialogPanel, Button } from "@headlessui/react";

// icons
import { X } from "lucide-react";

type IProps = {
  open: boolean;
  title: string;
  handleConfirmation: () => void;
  handleCancellation: () => void;
};

const AlertPopup: FC<IProps> = ({
  open,
  title,
  handleConfirmation,
  handleCancellation,
}) => {
  return (
    <Dialog open={open} onClose={handleCancellation} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative mx-4 flex w-full max-w-sm flex-col items-center rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-200 data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <button
            type="button"
            onClick={handleCancellation}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative size-12">
            <Image
              src={"/components/common/alert.png"}
              fill={true}
              className="object-cover"
              alt="alert-image"
            />
          </div>

          <h3 className="mt-4 text-center text-xl leading-snug font-semibold text-gray-800">
            {title}
          </h3>

          <div className="mt-6 flex w-full justify-between space-x-4">
            <Button
              onClick={handleCancellation}
              className="w-full rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-600 hover:bg-gray-300"
            >
              No
            </Button>

            <Button
              onClick={handleConfirmation}
              className="w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
            >
              Yes
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
export default AlertPopup;
