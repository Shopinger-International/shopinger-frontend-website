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

// helpers
import clsx from "clsx";

type SidebarDrawerProps = {
  children: ReactNode;
  is_open: boolean;
  handleClose: () => void;
  position?: "left" | "right";
  title: string;
};

const SidebarDrawer: FC<SidebarDrawerProps> = ({
  children,
  is_open,
  handleClose,
  title,
  position = "right",
}) => {
  const is_left = position === "left";
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
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        <div
          className={clsx(
            "fixed inset-0 flex items-end justify-center sm:items-stretch sm:justify-end",
            is_left ? "sm:justify-start" : "sm:justify-end",
          )}
        >
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom={
              is_left
                ? "translate-y-full sm:translate-y-0 sm:-translate-x-full"
                : "translate-y-full sm:translate-y-0 sm:translate-x-full"
            }
            enterTo="translate-y-0 sm:translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-y-0 sm:translate-x-0"
            leaveTo={
              is_left
                ? "translate-y-full sm:translate-y-0 sm:-translate-x-full"
                : "translate-y-full sm:translate-y-0 sm:translate-x-full"
            }
          >
            <DialogPanel
              className={`relative flex h-full w-full flex-col bg-white pt-6 shadow-xl sm:max-w-sm ${
                is_left
                  ? "border-r border-gray-300"
                  : "border-l border-gray-300"
              }`}
            >
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 shrink-0 rounded-md p-2 transition hover:bg-gray-200"
                aria-label="Close"
              >
                <X className="size-6 sm:size-5" />
              </button>

              <DialogTitle className="mb-4 px-6 text-lg font-bold">
                {title}
              </DialogTitle>
              <div className="min-h-0 flex-1">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SidebarDrawer;
