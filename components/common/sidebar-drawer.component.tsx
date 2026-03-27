import { Fragment } from "react";

// types
import type { FC, ReactNode } from "react";

// icons
import { X } from "lucide-react";

// external components
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

type SidebarDrawerProps = {
  children: ReactNode;
  is_open: boolean;
  handleClose: () => void;
  title: string;
};

const SidebarDrawer: FC<SidebarDrawerProps> = ({
  children,
  is_open,
  handleClose,
  title,
}) => {
  return (
    <Transition show={is_open} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
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
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        {/* Container Logic:
            - items-end: aligns to bottom on mobile
            - sm:items-stretch: spans full height on desktop
            - sm:justify-start: pins to left on desktop
        */}
        <div className="fixed inset-0 flex items-end justify-center sm:items-stretch sm:justify-start">
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            // Mobile: slide from bottom (translate-y)
            // Desktop: slide from left (sm:-translate-x)
            enterFrom="translate-y-full sm:translate-y-0 sm:-translate-x-full"
            enterTo="translate-y-0 sm:translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-y-0 sm:translate-x-0"
            leaveTo="translate-y-full sm:translate-y-0 sm:-translate-x-full"
          >
            <DialogPanel className="relative flex w-full flex-col rounded-t-2xl bg-white py-6 shadow-xl sm:h-full sm:max-w-sm sm:rounded-none">
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 shrink-0 rounded-md p-2 transition hover:bg-gray-200"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              <DialogTitle className="mb-2 px-6 text-lg font-bold">
                {title}
              </DialogTitle>

              {/* Scrollable content */}
              <div className="max-h-[80vh] flex-1 overflow-y-auto px-6 sm:max-h-none">
                {children}
              </div>

              {/* Bottom action */}
              <div className="mt-4 px-6">
                <button className="w-full rounded-lg bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600">
                  Add New Address
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SidebarDrawer;
